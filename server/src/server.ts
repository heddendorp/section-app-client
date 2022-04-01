import express from 'express';
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  sendResult,
  shouldRenderGraphiQL,
} from 'graphql-helix';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import cors from 'cors';
import compression from 'compression';
import { socialRouter } from './helpers/socialImage';
import { webhookRouter } from './helpers/webhooks';
import { calendarRouter } from './helpers/calendars';
import { qrRouter } from './helpers/qrCode';
import { shortRouter } from './helpers/shortRouter';
import prisma from './client';
import { Auth0 } from './helpers/auth0';
import { $settings } from './generated/nexus-prisma';
import { getEnveloped } from './getEnveloped';
import { prismaUtils } from './utils';

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
app.use('/graphql', async (req, res) => {
  const { parse, validate, contextFactory, execute, schema } = getEnveloped({
    req,
    prisma,
    auth0: new Auth0(),
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
    prismaUtils().then(() => {
      console.log(`DB actions finished`);
    });
    console.log(`GraphQL server is running on port ${port}.`);
  });
