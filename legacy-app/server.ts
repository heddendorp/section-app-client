// import '@angular/platform-server/init';
import 'zone.js/node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import { Request, Response } from 'express';
import * as express from 'express';
import { join } from 'path';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { version } from './package.json';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';

// Polyfills required for Firebase
(global as any).WebSocket = require('ws');
(global as any).XMLHttpRequest = require('xhr2');

// The Express app is exported so that it can be used by serverless Functions.
export const app = (): express.Express => {
  const server = express();
  Sentry.init({
    dsn:
      'https://03588ce705ed47ad9c0f82b4ad9676d9@o541164.ingest.sentry.io/5677343',
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app: server }),
    ],
    release: `universal-render@${process.env.NPM_PACKAGE_VERSION}`,
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });

  // RequestHandler creates a separate execution context using domains, so that every
  // transaction/span/breadcrumb is attached to its own Hub instance
  server.use(Sentry.Handlers.requestHandler());
  // TracingHandler creates a trace for every incoming request
  server.use(Sentry.Handlers.tracingHandler());

  const distFolder = join(process.cwd(), 'dist/tumi-app/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index.html';
  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
    })
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
  );

  // All regular routes use the Universal engine
  server.get('*', (req: Request, res: Response) => {
    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    });
  });

  // The error handler must be before any other error middleware and after all controllers
  server.use(Sentry.Handlers.errorHandler());

  return server;
};

const run = (): void => {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
};

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
// eslint-disable-next-line
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
