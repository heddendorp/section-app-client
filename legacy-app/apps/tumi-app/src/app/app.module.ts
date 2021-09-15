import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MarkdownModule } from 'ngx-markdown';
import { onError } from '@apollo/client/link/error';
import { CheckUserGuard } from './guards/check-user.guard';
import {
  AngularPlugin,
  ApplicationinsightsAngularpluginErrorService,
} from '@microsoft/applicationinsights-angularplugin-js';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { environment } from '../environments/environment';

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
    ]),
    AuthModule.forRoot({
      domain: 'tumi.eu.auth0.com',
      clientId: '9HrqRBDGhlb6P3NsYKmTbTOVGTv5ZgG8',
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
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        const http = httpLink.create({ uri: '/graphql' });
        const error = onError(({ graphQLErrors, networkError }) => {
          if (graphQLErrors)
            graphQLErrors.map(({ message, locations, path }) =>
              console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
              )
            );

          if (networkError) console.log(`[Network error]: ${networkError}`);
        });

        const link = error.concat(http);

        return {
          link,
          cache: new InMemoryCache(),
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
  constructor(router: Router) {
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
  }
}
