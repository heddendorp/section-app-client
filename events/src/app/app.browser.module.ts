import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import * as Sentry from '@sentry/angular';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  imports: [
    AppModule,
    AuthModule.forRoot({
      domain: 'tumi.eu.auth0.com',
      clientId: '9HrqRBDGhlb6P3NsYKmTbTOVGTv5ZgG8',
      audience: 'esn.events',
      useRefreshTokens: true,
      cacheLocation: 'localstorage',
      httpInterceptor: {
        allowedList: [
          {
            uriMatcher: (uri) => uri.includes('/graphql'),
            allowAnonymous: true,
          },
        ],
      },
    }),
  ],
  bootstrap: [AppComponent],
  providers: [
    environment.production
      ? {
          provide: ErrorHandler,
          useValue: Sentry.createErrorHandler({
            showDialog: true,
          }),
        }
      : [],
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
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
  ],
})
export class AppBrowserModuleModule {}
