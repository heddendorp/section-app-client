import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as Sentry from '@sentry/angular';
import { BrowserTracing } from '@sentry/tracing';
import { getActiveTransaction } from '@sentry/angular';

window.addEventListener('load', () => {
  console.log('page is fully loaded');
});

let bootstrapSpan: any = null;

if (environment.production) {
  enableProdMode();
  if (environment.version !== 'test') {
    console.log(`Version: ${environment.version}`);
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
    const activeTransaction = getActiveTransaction();
    bootstrapSpan =
      activeTransaction &&
      activeTransaction.startChild({
        description: 'platform-browser-dynamic',
        op: 'ui.angular.bootstrap',
      });
  }
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(() => console.log(`Bootstrap success`))
  .catch((err) => console.error(err))
  .finally(() => {
    if (bootstrapSpan) {
      bootstrapSpan.finish();
    }
  });
