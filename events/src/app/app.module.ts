import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule, Meta, Title } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthButtonComponent } from './components/auth-button/auth-button.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './modules/shared/shared.module';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { MarkdownModule } from 'ngx-markdown';
import { environment } from '../environments/environment';
import * as Sentry from '@sentry/angular';
import { Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [AppComponent, AuthButtonComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    TransferHttpCacheModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    GraphQLModule,
    HttpClientModule,
    MarkdownModule.forRoot(),
    SharedModule,
    MatSidenavModule,
  ],
  providers: [
    Meta,
    Title,
    environment.production
      ? [
          {
            provide: ErrorHandler,
            useValue: Sentry.createErrorHandler({
              showDialog: true,
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
export class AppModule {}
