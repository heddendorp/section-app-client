import express from 'express';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import compression from 'compression';
import { socialRouter } from './helpers/socialImage';
import { webhookRouter } from './helpers/webhooks';
import { calendarRouter } from './helpers/calendars';
import { qrRouter } from './helpers/qrCode';
import { shortRouter } from './helpers/shortRouter';
import prisma from './client';
import { Auth0 } from './helpers/auth0';
import { $settings } from './generated/nexus-prisma';
import { envelopPlugins } from './getEnveloped';
import { createServer } from '@graphql-yoga/node';
import { schema } from './schema';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      picture: string;
    }

    interface Request {
      user?: User;
      token?: {
        iss: string;
        sub: string;
        aud: string[];
        iat: number;
        exp: number;
        azp: string;
        scope: string;
      };
    }
  }
}

const app = express();

const graphQLServer = createServer({
  schema,
  context: {
    prisma,
    auth0: new Auth0(),
  },
  plugins: envelopPlugins,
});

Sentry.init({
  dsn: 'https://c8db9c4c39354afba335461b01c35418@o541164.ingest.sentry.io/6188953',
  environment: process.env.NODE_ENV ?? 'development',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

$settings({
  checks: {
    PrismaClientOnContext: false,
  },
});

app.use(compression());
app.get('/health', (req, res) => {
  res.sendStatus(200);
});
app.use('/webhooks', webhookRouter(prisma));
app.use(express.json());
app.use('/cal', calendarRouter());
app.use('/qr', qrRouter());
app.use('/go', shortRouter());
app.use('/graphql', graphQLServer);
app.use(socialRouter);
app.use(Sentry.Handlers.errorHandler());
const port = process.env.PORT || 3333;

process.env.NODE_ENV !== 'test' &&
  app.listen(port, () => {
    /*prismaUtils().then(() => {
  console.log(`DB actions finished`);
});*/
    console.log(`GraphQL server is running on port ${port}.`);
  });
