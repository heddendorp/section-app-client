import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from './environments/environment';
import { AppBrowserModuleModule } from './app/app.browser.module';
import * as Sentry from '@sentry/angular';
import { BrowserTracing } from '@sentry/tracing';

if (environment.production) {
  enableProdMode();
  Sentry.init({
    dsn: 'https://9ca284182b304514a87e6a8d1e9c23d2@o541164.ingest.sentry.io/6188986',
    environment: environment.production ? 'production' : 'development',
    integrations: [
      new BrowserTracing({
        tracingOrigins: ['localhost', environment.server],
        routingInstrumentation: Sentry.routingInstrumentation,
      }),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

function bootstrap() {
  platformBrowserDynamic()
    .bootstrapModule(AppBrowserModuleModule)
    .catch((err) => console.error(err));
}
if (document.readyState === 'complete') {
  bootstrap();
} else {
  document.addEventListener('DOMContentLoaded', bootstrap);
}
