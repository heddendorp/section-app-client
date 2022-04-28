import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as Sentry from '@sentry/angular';
import { BrowserTracing } from '@sentry/tracing';

if (environment.production) {
  enableProdMode();
  Sentry.init({
    dsn: 'https://d5d2f5fb92034473ae598a357ce3eb5c@o541164.ingest.sentry.io/6366795',
    environment: environment.production ? 'production' : 'development',
    release: 'legacy-app@' + environment.version,
    integrations: [
      new BrowserTracing({
        tracingOrigins: ['localhost', 'tumi.esn.world', /^\//],
        routingInstrumentation: Sentry.routingInstrumentation,
      }),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.2,
  });
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
