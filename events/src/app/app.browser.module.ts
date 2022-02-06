import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { UniversalModule } from '@ng-web-apis/universal';
import { AuthModule } from '@auth0/auth0-angular';

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
            uri: '/graphql',
            allowAnonymous: true,
          },
        ],
      },
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppBrowserModuleModule {}
