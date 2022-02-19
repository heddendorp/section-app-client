import {
  ApplicationRef,
  ErrorHandler,
  Inject,
  NgModule,
  PLATFORM_ID,
} from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  AuthGuard,
  AuthHttpInterceptor,
  AuthModule,
} from '@auth0/auth0-angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UiAppShellModule } from '@tumi/ui-app-shell';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBar,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { MarkdownModule } from 'ngx-markdown';
import { onError } from '@apollo/client/link/error';
import { CheckUserGuard } from './guards/check-user.guard';
import {
  AngularPlugin,
  ApplicationinsightsAngularpluginErrorService,
} from '@microsoft/applicationinsights-angularplugin-js';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { environment } from '../environments/environment';
import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';
import { concat, first, interval } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import {
  IconToastComponent,
  UtilComponentsModule,
} from '@tumi/util-components';
import { sha256 } from 'crypto-hash';
import { createPersistedQueryLink } from 'apollo-angular/persisted-queries';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MarkdownModule.forRoot(),
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', redirectTo: 'events' },
      { path: 'about', pathMatch: 'full', redirectTo: 'page/about' },
      {
        path: 'profile',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('@tumi/ui/profile').then((module) => module.UiProfileModule),
      },
      {
        path: 'event-templates',
        canActivate: [AuthGuard, CheckUserGuard],
        loadChildren: () =>
          import('@tumi/ui/event-templates').then(
            (module) => module.UiEventTemplatesModule
          ),
      },
      {
        path: 'events',
        loadChildren: () =>
          import('@tumi/ui/events').then((module) => module.UiEventsModule),
      },
      {
        path: 'tenant',
        canActivate: [AuthGuard, CheckUserGuard],
        loadChildren: () =>
          import('@tumi/ui/tenant').then((module) => module.UiTenantModule),
      },
      {
        path: 'feedback',
        loadChildren: () =>
          import('@tumi/ui/feedback').then((module) => module.UiFeedbackModule),
      },
      {
        path: 'page',
        loadChildren: () =>
          import('@tumi/ui/pages').then((module) => module.UiPagesModule),
      },
      {
        path: 'shop',
        loadChildren: () =>
          import('@tumi/ui/products').then((module) => module.UiProductsModule),
      },
      {
        path: 'basket',
        loadChildren: () =>
          import('@tumi/ui/shopping-basket').then(
            (module) => module.UiShoppingBasketModule
          ),
      },
      {
        path: 'home',
        loadChildren: () =>
          import('@tumi/ui/home').then((module) => module.UiHomeModule),
      },
    ]),
    AuthModule.forRoot({
      domain: 'tumi.eu.auth0.com',
      clientId: '9HrqRBDGhlb6P3NsYKmTbTOVGTv5ZgG8',
      cacheLocation: 'localstorage',
      useRefreshTokens: true,
      audience: 'esn.events',
      httpInterceptor: {
        allowedList: [
          {
            uri: '/graphql',
            allowAnonymous: true,
          },
        ],
      },
    }),
    FlexLayoutModule,
    UiAppShellModule,
    UtilComponentsModule,
    MatSnackBarModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
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
          uri: '/graphql',
          includeExtensions: true,
        });
        const error = onError(({ graphQLErrors, networkError }) => {
          if (graphQLErrors)
            graphQLErrors.map(({ message, locations, path }) =>
              console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
              )
            );

          if (networkError) console.log(`[Network error]: `, networkError);
        });
        const link = error
          .concat(
            createPersistedQueryLink({
              sha256,
              useGETForHashedQueries: true,
            })
          )
          .concat(http);

        const cache = new InMemoryCache({
          typePolicies: {
            UsersOfTenants: { keyFields: ['userId', 'tenantId'] },
          },
        });
        // persistCache({
        //   cache,
        //   storage: new LocalStorageWrapper(window.localStorage),
        //   debug: !environment.production,
        // });

        return {
          link,
          cache,
        };
        // return {
        //   cache: new InMemoryCache(),
        //   link: httpLink.create({
        //     uri: '/graphql',
        //   }),
        // };
      },
      deps: [HttpLink],
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'fill' },
    },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5000 } },
    environment.production
      ? [
          {
            provide: ErrorHandler,
            useClass: ApplicationinsightsAngularpluginErrorService,
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
    @Inject(PLATFORM_ID) platform: any
  ) {
    if (environment.production) {
      const angularPlugin = new AngularPlugin();
      const appInsights = new ApplicationInsights({
        config: {
          connectionString:
            'InstrumentationKey=f366572f-cd84-482d-bd75-ba65076988c8;IngestionEndpoint=https://germanywestcentral-1.in.applicationinsights.azure.com/',
          disableFetchTracking: false,
          enableRequestHeaderTracking: true,
          enableResponseHeaderTracking: true,
          extensions: [angularPlugin],
          extensionConfig: {
            [angularPlugin.identifier]: { router },
          },
        },
      });
      appInsights.loadAppInsights();
    }
    const appIsStable$ = appRef.isStable.pipe(first((isStable) => isStable));
    const updateCheckTimer$ = interval(0.5 * 2 * 60 * 1000);
    const updateChecksOnceAppStable$ = concat(appIsStable$, updateCheckTimer$);
    if (environment.production && isPlatformBrowser(platform)) {
      updateChecksOnceAppStable$.subscribe(() => updates.checkForUpdate());
    }
    updates.available.subscribe((event) => {
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
