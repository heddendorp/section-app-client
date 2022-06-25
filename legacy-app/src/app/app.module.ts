import {
  APP_INITIALIZER,
  ApplicationRef,
  ErrorHandler,
  Inject,
  NgModule,
  PLATFORM_ID,
} from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { HttpLink } from 'apollo-angular/http';
import { NavigationComponent } from './components/navigation/navigation.component';
import { AuthButtonComponent } from './components/auth-button/auth-button.component';
import { environment } from '../environments/environment';
import { onError } from '@apollo/client/link/error';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBar,
} from '@angular/material/snack-bar';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MarkdownModule } from 'ngx-markdown';
import {
  ServiceWorkerModule,
  SwUpdate,
  VersionReadyEvent,
} from '@angular/service-worker';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './modules/shared/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { isPlatformBrowser, ViewportScroller } from '@angular/common';
import { Router, Scroll } from '@angular/router';
import { concat, filter, first, interval } from 'rxjs';
import { IconToastComponent } from '@tumi/legacy-app/modules/shared/components/icon-toast/icon-toast.component';
import { Settings } from 'luxon';
import * as Sentry from '@sentry/angular';

@NgModule({
  declarations: [AppComponent, NavigationComponent, AuthButtonComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ApolloModule,
    HttpClientModule,
    ReactiveFormsModule,
    MarkdownModule.forRoot(),
    SharedModule,
    BrowserAnimationsModule,
    MatLuxonDateModule,
    AuthModule.forRoot({
      domain: 'tumi.eu.auth0.com',
      clientId: '9HrqRBDGhlb6P3NsYKmTbTOVGTv5ZgG8',
      cacheLocation: 'localstorage',
      useRefreshTokens: true,
      audience: 'esn.events',
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
    FlexLayoutModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    MatSidenavModule,
  ],
  providers: [
    Title,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
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
            graphQLErrors.map(({ message, locations, path }) =>
              console.log(
                `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
                  locations,
                  null,
                  2
                )}, Path: ${path}`
              )
            );
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
      deps: [HttpLink],
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5000 } },
    environment.production
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    router: Router,
    appRef: ApplicationRef,
    updates: SwUpdate,
    snackBar: MatSnackBar,
    viewportScroller: ViewportScroller,
    @Inject(PLATFORM_ID) platform: any
  ) {
    router.events
      .pipe(filter((e): e is Scroll => e instanceof Scroll))
      .subscribe((e) => {
        if (e.position) {
          setTimeout(() => {
            e.position && viewportScroller.scrollToPosition(e.position);
          }, 0);
        } else if (e.anchor) {
          viewportScroller.scrollToAnchor(e.anchor);
        } else {
          viewportScroller.scrollToPosition([0, 0]);
        }
      });
    // set default Luxon locale
    Settings.defaultLocale = 'en';
    const appIsStable$ = appRef.isStable.pipe(first((isStable) => isStable));
    const updateCheckTimer$ = interval(0.5 * 2 * 60 * 1000);
    const updateChecksOnceAppStable$ = concat(appIsStable$, updateCheckTimer$);
    if (environment.production && isPlatformBrowser(platform)) {
      updateChecksOnceAppStable$.subscribe(() => updates.checkForUpdate());
    }
    updates.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
      )
      .subscribe((event) => {
        snackBar
          .openFromComponent(IconToastComponent, {
            duration: 0,
            data: {
              message: 'A new version of this app is available!',
              action: 'Activate now',
              icon: 'icon-available-updates',
            },
          })
          .onAction()
          .subscribe(() =>
            updates.activateUpdate().then(() => document.location.reload())
          );
      });
  }
}
