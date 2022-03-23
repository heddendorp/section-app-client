import express from 'express';
import { schema } from './schema';
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  sendResult,
  shouldRenderGraphiQL,
} from 'graphql-helix';
import { envelop, useExtendContext, useSchema } from '@envelop/core';
import { useAuth0 } from '@envelop/auth0';
import { useSentry } from '@envelop/sentry';
import * as Sentry from '@sentry/node';
import { getCurrentHub } from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { PrismaClient, Tenant, User } from './generated/prisma';
import cors from 'cors';
import compression from 'compression';
import { socialRouter } from './helpers/socialImage';
import { useHive } from '@graphql-hive/client';
import { useGraphQLMiddleware } from '@envelop/graphql-middleware';
import { permissions } from './permissions';
import { webhookRouter } from './helpers/webhooks';

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

export const app = express();

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
  tracesSampleRate: 0.2,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(compression());
const prisma = new PrismaClient();
prisma.$use(async (params, next) => {
  const { model, action, runInTransaction, args } = params;
  const description = [model, action].filter(Boolean).join('.');
  const data = {
    model,
    action,
    runInTransaction,
    args,
  };

  const scope = getCurrentHub().getScope();
  const parentSpan = scope?.getSpan();
  const span = parentSpan?.startChild({
    op: 'db',
    description,
    data,
  });

  // optional but nice
  scope?.addBreadcrumb({
    category: 'db',
    message: description,
    data,
  });

  const result = await next(params);
  span?.finish();

  return result;
});
app.use(cors());
const getEnveloped = envelop({
  plugins: [
    useSchema(schema),
    // useLogger(),
    // useTiming(),
    ...(process.env.NODE_ENV !== 'test'
      ? [
          useHive({
            enabled: true,
            debug: process.env.NODE_ENV !== 'production', // or false
            token: process.env.HIVE_TOKEN ?? '',
            reporting: {
              // feel free to set dummy values here
              author: 'Author of the schema version',
              commit: 'git sha or any identifier',
            },
            usage: true,
          }),
        ]
      : []),
    useSentry(),
    useAuth0({
      domain: 'tumi.eu.auth0.com',
      audience: 'esn.events',
      extendContextField: 'token',
    }),
    useExtendContext(async (context) => {
      return {
        tenant: await context.prisma.tenant.findFirst(),
      };
    }),
    useExtendContext(async (context: { token: any; prisma: PrismaClient }) => {
      if (context.token) {
        let user = await context.prisma.user.findUnique({
          where: {
            authId: context.token.sub,
          },
        });
        if (!user) {
          user = await context.prisma.user.create({
            data: {
              authId: context.token.sub,
              email: '',
              firstName: '',
              lastName: '',
              email_verified: false,
              picture: '',
            },
          });
        }
        Sentry.setUser({ email: user.email, id: user.id });
        return {
          user,
        };
      }
    }),
    useExtendContext(
      async (context: {
        user?: User;
        prisma: PrismaClient;
        tenant: Tenant;
      }) => {
        if (context.user) {
          let assignment = await context.prisma.usersOfTenants.findUnique({
            where: {
              userId_tenantId: {
                userId: context.user.id,
                tenantId: context.tenant.id,
              },
            },
          });
          if (!assignment) {
            assignment = await context.prisma.usersOfTenants.create({
              data: {
                user: { connect: { id: context.user.id } },
                tenant: { connect: { id: context.tenant.id } },
              },
            });
          }
          return {
            assignment,
          };
        }
      }
    ),
    useGraphQLMiddleware([permissions]),
  ],
});

app.use(express.json());
app.use('/webhooks', webhookRouter(prisma));
app.use('/graphql', async (req, res) => {
  const { parse, validate, contextFactory, execute, schema } = getEnveloped({
    req,
    prisma,
  });
  // Create a generic Request object that can be consumed by Graphql Helix's API
  const request = {
    body: req.body,
    headers: req.headers,
    method: req.method,
    query: req.query,
  };

  // Determine whether we should render GraphiQL instead of returning an API response
  if (shouldRenderGraphiQL(request)) {
    res.send(renderGraphiQL());
  } else {
    // Extract the Graphql parameters from the request
    const { operationName, query, variables } = getGraphQLParameters(request);

    // Validate and execute the query
    const result = await processRequest({
      operationName,
      query,
      variables,
      request,
      schema,
      parse,
      validate,
      execute,
      contextFactory,
    });

    // processRequest returns one of three types of results depending on how the server should respond
    // 1) RESPONSE: a regular JSON payload
    // 2) MULTIPART RESPONSE: a multipart response (when @stream or @defer directives are used)
    // 3) PUSH: a stream of events to push back down the client for a subscription
    // The "sendResult" is a NodeJS-only shortcut for handling all possible types of Graphql responses,
    // See "Advanced Usage" below for more details and customizations available on that layer.
    await sendResult(result, res);
  }
});
app.use(socialRouter);
app.use(Sentry.Handlers.errorHandler());
const port = process.env.PORT || 3333;

process.env.NODE_ENV !== 'test' &&
  app.listen(port, () => {
    console.log(`GraphQL server is running on port ${port}.`);
  });
