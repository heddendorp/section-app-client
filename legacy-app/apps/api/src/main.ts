import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginDrainHttpServer,
  GraphQLRequestContext,
} from 'apollo-server-core';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import { schema } from '@tumi/server-graphql';
import { checkJwt, getUser } from './app/auth';
import { UiAuth0 } from './app/auth0';
import { seedDB } from './app/seeding';
import { webhookRouter } from './app/webhooks';
import { calendarRouter } from './app/calendars';
import { qrRouter } from './app/qrCode';
import { shortRouter } from './app/shortRouter';
import { DBClient } from '@tumi/server/services';

const prisma = DBClient.getInstance().prisma;

// Make sure our db has one tenant
seedDB(prisma).then(() => {
  console.debug('Seed completed ✔️');
});

// Required logic for integrating with Express
const app = express();
const httpServer = http.createServer(app);
if (process.env.DOWN) {
  app.use('/health', (req, res) => res.status(503).send({ maintenance: true }));
  app.use('*', (req, res) =>
    res.status(503).sendfile(path.join(__dirname, 'assets', 'down.html'))
  );
}
app.use('/', express.static(path.join(__dirname, '..', 'tumi-app', 'browser')));
app.use('/webhooks', webhookRouter(prisma));
app.use('/cal', calendarRouter(prisma));
app.use('/qr', qrRouter());
app.use('/go', shortRouter());
app.get('/health', async (req, res) => {
  try {
    const tenant = await prisma.tenant.findFirst();
    res.json(tenant);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});
app.use(checkJwt);
app.use(getUser(prisma));

const measurementPlugin = {
  async requestDidStart() {
    console.log('\n');
    const before = Date.now();
    return {
      async willSendResponse(requestContext: GraphQLRequestContext) {
        const after = Date.now();
        console.log(
          `Operation ${requestContext.operationName} took ${after - before}ms`
        );
      },
    };
  },
};

const server = new ApolloServer({
  schema,
  async context({ req }) {
    const tenant = await prisma.tenant.findFirst();
    return {
      prisma,
      user: req.user,
      token: req.token,
      auth0: new UiAuth0(),
      tenant,
      assignment: req.user
        ? await prisma.usersOfTenants.findUnique({
            where: {
              userId_tenantId: { userId: req.user.id, tenantId: tenant.id },
            },
          })
        : {},
    };
  },
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    // ApolloServerPluginCacheControl(),
    measurementPlugin,
  ],
});

server.start().then(() => {
  server.applyMiddleware({ app });
  // app.get('ngsw.json', (req, res) => res.sendStatus(404));
  app.get('*', function (request, response) {
    response.sendFile(
      path.resolve(__dirname, '..', 'tumi-app', 'browser', 'index.html')
    );
  });
  httpServer.listen({ port: process.env.PORT ?? 3333 }, () => {
    console.log(`
    🚀 Server ready at http://localhost:3333
    🕵️ GraphQL ready at: http://localhost:3333${server.graphqlPath}
    `);
  });
});
