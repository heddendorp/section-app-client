import {
  ApplicationRef,
  ErrorHandler,
  Inject,
  NgModule,
  PLATFORM_ID,
} from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  AuthGuard,
  AuthHttpInterceptor,
  AuthModule,
} from '@auth0/auth0-angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UiAppShellModule } from '@tumi/ui-app-shell';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { Router, RouterModule, Scroll } from '@angular/router';
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
import { environment } from '../environments/environment';
import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';
import { concat, filter, first, interval } from 'rxjs';
import { isPlatformBrowser, ViewportScroller } from '@angular/common';
import {
  IconToastComponent,
  UtilComponentsModule,
} from '@tumi/util-components';
import { Settings } from 'luxon';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MarkdownModule.forRoot(),
    ApolloModule,
    RouterModule.forRoot(
      [
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
            import('@tumi/ui/feedback').then(
              (module) => module.UiFeedbackModule
            ),
        },
        {
          path: 'page',
          loadChildren: () =>
            import('@tumi/ui/pages').then((module) => module.UiPagesModule),
        },
        {
          path: 'shop',
          loadChildren: () =>
            import('@tumi/ui/products').then(
              (module) => module.UiProductsModule
            ),
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
      ],
      { scrollPositionRestoration: 'disabled' }
    ),
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
          uri: environment.server + '/graphql',
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
          if (graphQLErrors)
            graphQLErrors.map(({ message, locations, path }) =>
              console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
              )
            );

          if (networkError) console.log(`[Network error]: `, networkError);
        });
        const link = error
          // .concat(
          //   createPersistedQueryLink({
          //     sha256,
          //     useGETForHashedQueries: true,
          //   })
          // )
          .concat(addClientName)
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
