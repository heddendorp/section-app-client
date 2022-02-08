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
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import compression from 'compression';
import { socialRouter } from './helpers/socialImage';
import { useHive } from '@graphql-hive/client';

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
// context: createContext,

const app = express();
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
  tracesSampleRate: 1.0,
});
app.use(cors());
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
const getEnveloped = envelop({
  plugins: [
    useSchema(schema),
    // useLogger(),
    // useTiming(),
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
    useExtendContext(async (context) => {
      if (context.token) {
        const user = await context.prisma.user.findUnique({
          where: {
            authId: context.token.sub,
          },
        });
        Sentry.setUser({ email: user.email, id: user.id });
        return {
          user,
        };
      }
    }),
    useExtendContext(async (context) => {
      if (context.user) {
        return {
          assignment: await context.prisma.usersOfTenants.findUnique({
            where: {
              userId_tenantId: {
                userId: context.user.id,
                tenantId: context.tenant.id,
              },
            },
          }),
        };
      }
    }),
  ],
});

app.use(express.json());

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

app.listen(port, () => {
  console.log(`GraphQL server is running on port ${port}.`);
});
