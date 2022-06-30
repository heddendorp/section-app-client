import express from 'express';
import * as Sentry from '@sentry/node';
import cors from 'cors';
import * as Tracing from '@sentry/tracing';
import compression from 'compression';
import { socialRouter } from './helpers/socialImage';
import { webhookRouter } from './helpers/webhooks';
import { calendarRouter } from './helpers/calendars';
import { qrRouter } from './helpers/qrCode';
import { shortRouter } from './helpers/shortRouter';
import prisma from './client';
import { Auth0 } from './helpers/auth0';
import { createServer, enableIf, GraphQLYogaError } from '@graphql-yoga/node';
import { schema } from './schema';
import prom from 'prom-client';
import { useAuth0 } from '@envelop/auth0';
import { Plugin, useExtendContext } from '@envelop/core';
import { useHive } from '@graphql-hive/client';
import { setupCronjob } from './helpers/cronjobs';
import { useResponseCache } from '@envelop/response-cache';
import { useGraphQlJit } from '@envelop/graphql-jit';
import { useSentry } from '@envelop/sentry';
import { AttributeNames } from '@pothos/tracing-sentry';
import { print } from 'graphql/language';

declare global {
  namespace NodeJS {
    interface Global {
      __rootdir__: string;
    }
  }
}
global.__rootdir__ = __dirname || process.cwd();

const isProd = process.env.NODE_ENV === 'production';

const app = express();

Sentry.init({
  dsn: 'https://c8db9c4c39354afba335461b01c35418@o541164.ingest.sentry.io/6188953',
  environment: process.env.NODE_ENV ?? 'development',
  integrations: [
    // new RewriteFrames({
    //   root: global.__rootdir__,
    // }),
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

const register = new prom.Registry();
prom.collectDefaultMetrics({ register });

setupCronjob(prisma);
const auth0 = new Auth0();

const tracingPlugin: Plugin = {
  onExecute: ({ setExecuteFn, executeFn }) => {
    setExecuteFn(async (options) => {
      const transaction = Sentry.startTransaction({
        op: 'graphql.execute',
        name: options.operationName ?? '<unnamed operation>',
        tags: {
          [AttributeNames.OPERATION_NAME]: options.operationName ?? undefined,
          [AttributeNames.SOURCE]: print(options.document),
        },
        data: {
          [AttributeNames.SOURCE]: print(options.document),
        },
      });
      Sentry.getCurrentHub().configureScope((scope) =>
        scope.setSpan(transaction)
      );

      try {
        const result = await executeFn(options);

        return result;
      } finally {
        transaction.finish();
      }
    });
  },
};

const graphQLServer = createServer({
  schema,
  context: async ({ req }) => ({
    auth0,
  }),
  plugins: [
    enableIf(isProd, useSentry({ trackResolvers: false })),
    enableIf(isProd, tracingPlugin),
    useHive({
      enabled: true,
      debug: process.env.NODE_ENV !== 'production', // or false
      token: process.env.HIVE_TOKEN ?? '',
      reporting: {
        // feel free to set dummy values here
        author: 'Author of the schema version',
        commit: 'git sha or any identifier',
      },
      usage: {
        clientInfo(context: any) {
          const name = context.req.headers['x-graphql-client-name'];
          const version = context.req.headers['x-graphql-client-version'];
          if (name && version) {
            return {
              name,
              version,
            };
          }
          return null;
        },
      },
    }),
    useAuth0({
      domain: 'tumi.eu.auth0.com',
      audience: 'esn.events',
      extendContextField: 'token',
    }),
    useExtendContext(async (context) => {
      const url = new URL(context.req.headers.origin);
      const hostName = url.hostname;
      let tenantName = hostName.split('.')[0];
      if (tenantName === 'localhost') {
        tenantName = 'tumi';
      }
      if (tenantName === 'beta') {
        tenantName = 'tumi';
      }
      if (tenantName === 'dev') {
        tenantName = 'tumi';
      }
      if (tenantName.includes('deploy-preview')) {
        tenantName = 'tumi';
      }
      let tenant;
      try {
        tenant = await prisma.tenant.findUnique({
          where: {
            shortName: tenantName,
          },
        });
      } catch (e) {
        console.error(e);
        console.log(tenantName);
        console.log(context.req.headers.origin);
        console.log(context.req.headers.host);
        throw new GraphQLYogaError('Tenant not found', {
          error: e,
        });
      }
      if (context.token) {
        let user = await prisma.user.findUnique({
          where: {
            authId: context.token.sub,
          },
          include: {
            tenants: { where: { tenantId: tenant.id } },
          },
          rejectOnNotFound: false,
        });
        if (user && !user.tenants.length) {
          try {
            user = await prisma.user.update({
              where: {
                id: user.id,
              },
              data: {
                tenants: {
                  create: {
                    tenantId: tenant.id,
                  },
                },
              },
              include: {
                tenants: { where: { tenantId: tenant.id } },
              },
            });
          } catch (e) {
            console.error(e);
            user = await prisma.user.findUnique({
              where: {
                authId: context.token.sub,
              },
              include: {
                tenants: { where: { tenantId: tenant.id } },
              },
              rejectOnNotFound: false,
            });
          }
        }
        return { ...context, tenant, user, userOfTenant: user?.tenants[0] };
      }
      return { ...context, tenant };
    }),
    useGraphQlJit(),
    useResponseCache({
      ttl: 2000,
      includeExtensionMetadata: true,
      session: (context) => String(context.user?.id),
    }),
  ],
  parserCache: true,
  validationCache: true,
  maskedErrors: false,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

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

process.env.NODE_ENV !== 'test' && app.listen(port, async () => {});
