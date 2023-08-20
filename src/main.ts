import {
  APP_INITIALIZER,
  DEFAULT_CURRENCY_CODE,
  enableProdMode,
  ErrorHandler,
  importProvidersFrom,
} from '@angular/core';

import { environment } from './environments/environment';
import * as Sentry from '@sentry/angular-ivy';
import { getActiveTransaction } from '@sentry/angular-ivy';
import { BrowserTracing } from '@sentry/tracing';
import { AppComponent } from './app/app.component';
import { MatDialogModule } from '@angular/material/dialog';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatRippleModule } from '@angular/material/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MarkdownModule } from 'ngx-markdown';
import { ReactiveFormsModule } from '@angular/forms';
import { APP_ROUTES } from '@tumi/legacy-app/app.routes';
import { provideRouter, Router } from '@angular/router';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { onError } from '@apollo/client/link/error';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { HttpBatchLink } from 'apollo-angular/http';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
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
} from '@angular/common/http';
import {
  bootstrapApplication,
  BrowserModule,
  Title,
} from '@angular/platform-browser';
import { ConfigService } from '@tumi/legacy-app/services/config.service';

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
          shouldCreateSpanForRequest(): boolean {
            return true;
          },
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

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      ApolloModule,
      ReactiveFormsModule,
      MarkdownModule.forRoot(),
      MatLuxonDateModule,
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
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production && environment.version !== 'test',
        // Register the ServiceWorker as soon as the app is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000',
      }),
      MatRippleModule,
      GoogleMapsModule,
      MatSnackBarModule,
      MatDialogModule,
    ),
    Title,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TenantHeaderInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpBatchLink, authService: AuthService) => {
        const http = httpLink.create({
          uri: environment.useApiPath
            ? '/graphql'
            : `${environment.server}/graphql`,
          includeExtensions: true,
        });
        const addClientName = new ApolloLink((operation, forward) => {
          operation.setContext({
            headers: new HttpHeaders()
              .set('x-graphql-client-name', 'leagcy-app')
              .set('x-graphql-client-version', environment.version),
          });
          return forward(operation);
        });
        const error = onError(({ graphQLErrors, networkError }) => {
          if (graphQLErrors) {
            Sentry.addBreadcrumb({
              message: 'GraphQL error',
              category: 'GraphQL error',
              type: 'error',
              data: graphQLErrors,
            });
            graphQLErrors.map(({ message, locations, path }) => {
              if (message.includes('jwt issuer invalid')) {
                authService.logout();
              }
              console.log(
                `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
                  locations,
                  null,
                  2,
                )}, Path: ${path}`,
              );
            });
          }
          if (networkError) {
            Sentry.addBreadcrumb({
              message: 'Network error',
              category: 'GraphQL error',
              type: 'error',
              data: networkError,
            });
            console.log(`[Network error]: `, networkError);
          }
        });
        const link = error.concat(addClientName).concat(http);
        const cache = new InMemoryCache({
          typePolicies: {
            UsersOfTenants: { keyFields: ['userId', 'tenantId'] },
          },
        });
        return {
          link,
          cache,
        };
      },
      deps: [HttpBatchLink, AuthService],
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (config: ConfigService) => () => config.init(),
      multi: true,
      deps: [ConfigService],
    },
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
            useValue: Sentry.createErrorHandler({
              showDialog: false,
            }),
          },
          {
            provide: Sentry.TraceService,
            deps: [Router],
          },
          {
            provide: APP_INITIALIZER,
            useFactory: () => () => {},
            deps: [Sentry.TraceService],
            multi: true,
          },
        ]
      : [],
    provideRouter(APP_ROUTES),
    provideHttpClient(withInterceptorsFromDi(), withJsonpSupport()),
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
