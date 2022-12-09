import express from 'express';
import * as Sentry from '@sentry/node';
import cors from 'cors';
import * as Tracing from '@sentry/tracing';
import compression from 'compression';
import { webhookRouter } from './helpers/webhooks';
import { calendarRouter } from './helpers/calendars';
import { qrRouter } from './helpers/qrCode';
import { shortRouter } from './helpers/shortRouter';
import prisma from './client';
import { Auth0 } from './helpers/auth0';
import { createYoga, YogaInitialContext } from 'graphql-yoga';
import { schema } from './schema';
import prom from 'prom-client';
import { useAuth0, UserPayload } from '@envelop/auth0';
import { Plugin, useExtendContext } from '@envelop/core';
import { useHive } from '@graphql-hive/client';
import { useResponseCache } from '@envelop/response-cache';
import { useGraphQlJit } from '@envelop/graphql-jit';
import { AttributeNames } from '@pothos/tracing-sentry';
import { print } from 'graphql/language';
import { Settings } from 'luxon';
import CacheService from './helpers/cacheService';
import { Context } from './builder';
import { GraphQLError } from 'graphql';
import { createFetch } from '@whatwg-node/fetch';

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

Settings.defaultLocale = 'en';
Settings.defaultZone = 'Europe/Berlin';

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

const graphQLServer = createYoga({
  schema,
  context: {
    auth0,
  },
  fetchAPI: createFetch({
    useNodeFetch: true,
  }),
  plugins: [
    // enableIf(isProd, useSentry({ trackResolvers: false })),
    // enableIf(isProd, tracingPlugin),
    useHive({
      enabled: isProd,
      debug: !!process.env.DEV, // or false
      token: process.env.HIVE_TOKEN ?? '',
    }),
    useAuth0({
      domain: 'tumi.eu.auth0.com',
      audience: 'esn.events',
      extendContextField: 'token',
    }),
    useExtendContext(
      async (context: YogaInitialContext & { token?: UserPayload }) => {
        let tenantName = context.request.headers['x-tumi-tenant'];
        if (!tenantName) {
          const url = new URL(context.request.headers.get('origin') ?? '');
          const hostName = url.hostname;
          tenantName = hostName.split('.')[0];
        }
        if (
          context.request.headers.get('origin')?.includes('esn-karlsruhe.de')
        ) {
          tenantName = 'karlsruhe';
        }
        if (tenantName === 'localhost') {
          tenantName = 'tumi';
        }
        if (tenantName === 'beta') {
          tenantName = 'tumi';
        }
        if (tenantName === 'experiments') {
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
          tenant = await CacheService.getTenantFromShortName(tenantName);
        } catch (e) {
          console.error(e);
          console.log(tenantName);
          console.log(context.request.headers.get('origin'));
          console.log(context.request.headers.get('host'));
          throw new GraphQLError('Tenant not found', {
            extensions: { error: e },
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
              });
            }
          }
          return { ...context, tenant, user, userOfTenant: user?.tenants[0] };
        }
        return { ...context, tenant };
      }
    ),
    useGraphQlJit(),
    useResponseCache({
      ttl: 2000,
      includeExtensionMetadata: true,
      session: (context: Context) => String(context.user?.id ?? 'public'),
    }),
  ],
  parserCache: true,
  validationCache: true,
  maskedErrors: false,
  graphqlEndpoint: '/graphql',
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
app.use('/graphql', async (req, res, next) => {
  await graphQLServer.handle(req, res, next);
});
// app.use(socialRouter);
app.get('/metrics', async (_, res) => {
  const metrics = await prisma.$metrics.json({
    globalLabels: { app_version: process.env.VERSION ?? 'development' },
  });
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

app.listen(port, async () => {});

async function fixTransactions() {
  const registrations = await prisma.eventRegistration.findMany({
    include: { transactions: true },
  });
  console.log(`Found ${registrations.length} registrations`);
  let count = 0;
  for (const registration of registrations) {
    console.log(`Progress: ${count++}/${registrations.length}`);
    for (const transaction of registration.transactions) {
      const existingTransactions = await prisma.transaction.count({
        where: {
          subject: transaction.subject,
          amount: transaction.amount,
          direction: transaction.direction,
          id: { in: registration.transactions.map((t) => t.id) },
        },
      });
      if (existingTransactions > 1) {
        console.log(`-- Deleting transaction ${transaction.id}`);
        await prisma.transaction.delete({
          where: {
            id: transaction.id,
          },
        });
      } else {
        console.log(`++ Keeping transaction ${transaction.id}`);
      }
    }
  }
  console.log('Done');
}

// fixTransactions();
