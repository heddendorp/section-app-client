import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import { PrismaClient } from '@tumi/server-models';
import { schema } from '@tumi/server-graphql';
import { checkJwt, getUser } from './app/auth';
import { UiAuth0 } from './app/auth0';
import { seedDB } from './app/seeding';
import { webhookRouter } from './app/webhooks';
import { calendarRouter } from './app/calendars';

const prisma = new PrismaClient();

// Make sure our db has one tenant
seedDB(prisma).then(() => {
  console.debug('Seed completed ✔️');
});

// Required logic for integrating with Express
const app = express();
const httpServer = http.createServer(app);
app.use('/', express.static(path.join(__dirname, '..', 'tumi-app', 'browser')));
app.use('/webhooks', webhookRouter(prisma));
app.use('/cal', calendarRouter(prisma));
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

const server = new ApolloServer({
  schema,
  async context({ req }) {
    return {
      prisma,
      user: req.user,
      token: req.token,
      auth0: new UiAuth0(),
      tenant: await prisma.tenant.findFirst(),
    };
  },
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

server.start().then(() => {
  server.applyMiddleware({ app });
  app.get('ngsw.json', (req, res) => res.sendStatus(404));
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
