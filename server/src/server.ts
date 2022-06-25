import express from 'express';
import * as Sentry from '@sentry/node';
import cors from 'cors';
import * as Tracing from '@sentry/tracing';
import { RewriteFrames } from '@sentry/integrations';
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
import { setupCronjob } from './helpers/cronjobs';
import prom from 'prom-client';

declare global {
  namespace NodeJS {
    interface Global {
      __rootdir__: string;
    }
  }
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
global.__rootdir__ = __dirname || process.cwd();

const app = express();
const register = new prom.Registry();
prom.collectDefaultMetrics({ register });

setupCronjob(prisma);
const auth0 = new Auth0();

const graphQLServer = createServer({
  schema,
  context: {
    prisma,
    auth0,
  },
  plugins: envelopPlugins,
  parserCache: true,
  validationCache: true,
  maskedErrors: false,
});

Sentry.init({
  dsn: 'https://c8db9c4c39354afba335461b01c35418@o541164.ingest.sentry.io/6188953',
  environment: process.env.NODE_ENV ?? 'development',
  integrations: [
    new RewriteFrames({
      root: global.__rootdir__,
    }),
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
    // new Tracing.Integrations.GraphQL(),
    new Tracing.Integrations.Prisma({ client: prisma }),
  ],
  release: 'tumi-server@' + process.env.VERSION ?? 'development',
  ignoreErrors: ['GraphQLError', 'GraphQLYogaError'],
  beforeBreadcrumb(breadcrumb) {
    if (
      breadcrumb.category === 'http' &&
      breadcrumb.data?.url?.includes('graphql-hive')
    ) {
      return null;
    }
    return breadcrumb;
  },
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
app.use(cors());
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
app.get('/metrics', async (_, res) => {
  console.log('Getting metrics');
  const metrics = await prisma.$metrics.json({
    globalLabels: { app_version: process.env.VERSION ?? 'development' },
  });
  console.log(metrics);
  res.send(metrics);
});
app.get('/prom-metrics', async (_, res) => {
  let prismaMetrics = await prisma.$metrics.prometheus({
    globalLabels: { app_version: process.env.VERSION ?? 'development' },
  });
  let appMetrics = await register.metrics();
  res.end(prismaMetrics + appMetrics);
});
app.use(Sentry.Handlers.errorHandler());
const port = process.env.PORT || 3333;

process.env.NODE_ENV !== 'test' &&
  app.listen(port, async () => {
    // prismaUtils().then(() => {
    //   console.log(`DB actions finished`);
    // });
  });
