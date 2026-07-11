import {
  DEFAULT_CURRENCY_CODE,
  enableProdMode,
  ErrorHandler,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';

import { environment } from './environments/environment';
import * as Sentry from '@sentry/angular';
import { AppComponent } from './app/app.component';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideMarkdown } from 'ngx-markdown';
import { APP_ROUTES } from '@tumi/legacy-app/app.routes';
import {
  provideRouter,
  Router,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { HttpBatchLink, HttpLink } from 'apollo-angular/http';
import { provideApollo } from 'apollo-angular';
import {
  AuthHttpInterceptor,
  AuthModule,
  AuthService,
} from '@auth0/auth0-angular';
import { TenantHeaderInterceptor } from './app/services/tenant-header.interceptor';
import {
  HTTP_INTERCEPTORS,
  HttpHeaders,
  provideHttpClient,
  withInterceptorsFromDi,
  withJsonpSupport,
  withXhr,
} from '@angular/common/http';
import {
  bootstrapApplication,
  BrowserModule,
  Title,
} from '@angular/platform-browser';
import { ConfigService } from '@tumi/legacy-app/services/config.service';
import { provideLocalTestAuth } from './app/testing/local-test-auth.providers';
import { createApolloErrorLink } from './app/services/apollo-error-link';

let bootstrapSpan: any = null;

if (environment.production) {
  enableProdMode();
  if (environment.version !== 'test') {
    console.log(`Version: ${environment.version}`);
    Sentry.init({
      dsn: 'https://d5d2f5fb92034473ae598a357ce3eb5c@o541164.ingest.sentry.io/6366795',
      integrations: [
        // Registers and configures the Tracing integration,
        // which automatically instruments your application to monitor its
        // performance, including custom Angular routing instrumentation
        Sentry.browserTracingIntegration(),
        // Registers the Replay integration,
        // which automatically captures Session Replays
        Sentry.replayIntegration(),
      ],

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,

      // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: [
        'localhost',
        /^https:\/\/\w+\.esn\.world\/graphql/,
      ],

      // Capture Replay for 10% of all sessions,
      // plus for 100% of sessions with an error
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      release: environment.version,
    });
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    importProvidersFrom(BrowserModule, MatLuxonDateModule),
    environment.useLocalAuthMock
      ? provideLocalTestAuth()
      : importProvidersFrom(
          AuthModule.forRoot({
            domain: 'auth.esn.world',
            clientId: '9HrqRBDGhlb6P3NsYKmTbTOVGTv5ZgG8',
            cacheLocation: 'localstorage',
            // useRefreshTokens: true,
            authorizationParams: {
              audience: 'esn.events',
              redirect_uri: window.location.origin,
            },
            httpInterceptor: {
              allowedList: [
                {
                  uri: environment.server + '/graphql',
                  allowAnonymous: true,
                },
                {
                  uri: '/graphql',
                  allowAnonymous: true,
                },
              ],
            },
          }),
        ),
    provideMarkdown(),
    Title,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TenantHeaderInterceptor,
      multi: true,
    },
    environment.useLocalAuthMock
      ? []
      : {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthHttpInterceptor,
          multi: true,
        },
    provideApollo(() => {
      const batchHttpLink = inject(HttpBatchLink);
      const httpLink = inject(HttpLink);
      const authService = inject(AuthService);
      const linkOptions = {
        uri: environment.useApiPath
          ? '/graphql'
          : `${environment.server}/graphql`,
        includeExtensions: true,
      };
      const http = httpLink.create(linkOptions);
      const batchedHttp = batchHttpLink.create(linkOptions);
      const criticalOperationNames = new Set([
        'checkInUser',
        'useRegistrationEntry',
        'getRegistration',
      ]);
      const addClientName = new ApolloLink((operation, forward) => {
        operation.setContext({
          headers: new HttpHeaders()
            .set('x-graphql-client-name', 'leagcy-app')
            .set('x-graphql-client-version', environment.version),
        });
        return forward(operation);
      });
      const errorLink = createApolloErrorLink({
        addBreadcrumb: (breadcrumb) => Sentry.addBreadcrumb(breadcrumb),
        log: (...values) => console.log(...values),
        logout: () => {
          authService.logout();
        },
      });
      const transport = ApolloLink.split(
        (operation) =>
          criticalOperationNames.has(operation.operationName ?? ''),
        http,
        batchedHttp,
      );
      const link = errorLink.concat(addClientName).concat(transport);
      const cache = new InMemoryCache({
        typePolicies: {
          UsersOfTenants: { keyFields: ['userId', 'tenantId'] },
        },
      });
      return {
        link,
        cache,
        defaultOptions: {
          watchQuery: {
            notifyOnNetworkStatusChange: false,
          },
        },
      };
    }),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    provideAppInitializer(() => {
      const initializerFn = (
        (config: ConfigService) => () =>
          config.init()
      )(inject(ConfigService));
      return initializerFn();
    }),
    {
      provide: DEFAULT_CURRENCY_CODE,
      useFactory: (config: ConfigService) => config.currencyCode,
      deps: [ConfigService],
    },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5000 } },
    environment.production && environment.version !== 'test'
      ? [
          {
            provide: ErrorHandler,
            useValue: Sentry.createErrorHandler(),
          },
          {
            provide: Sentry.TraceService,
            deps: [Router],
          },
          provideAppInitializer(() => {
            inject(Sentry.TraceService);
          }),
        ]
      : [],
    provideRouter(
      APP_ROUTES,
      withComponentInputBinding(),
      withViewTransitions(),
    ),
    provideHttpClient(withXhr(), withInterceptorsFromDi(), withJsonpSupport()),
    provideAnimations(),
  ],
})
  .then(() => console.log(`Bootstrap success`))
  .catch((err) => console.error(err))
  .finally(() => {
    if (bootstrapSpan) {
      bootstrapSpan.finish();
    }
  });
