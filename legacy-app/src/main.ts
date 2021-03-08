import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Sentry from '@sentry/angular';
import { Integrations } from '@sentry/tracing';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { version } from '../package.json';

Sentry.init({
  dsn:
    'https://359ab042b2154a95bfcb20aa58d1c76e@o541164.ingest.sentry.io/5659633',
  environment: environment.production ? 'production' : 'development',
  release: `tumi-app@${version}`,
  integrations: [
    new Integrations.BrowserTracing({
      tracingOrigins: [
        'localhost',
        'https://tumi.esn.world',
        'https://esn-tumi.de',
      ],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

if (environment.production) {
  enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
});
