import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule, AuthHttpInterceptor } from '@auth0/auth0-angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppShellModule } from '@tumi/app-shell';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    AuthModule.forRoot({
      domain: 'tumi.eu.auth0.com',
      clientId: '9HrqRBDGhlb6P3NsYKmTbTOVGTv5ZgG8',
      audience: 'esn.events',
      httpInterceptor: {
        allowedList: ['/graphql'],
      },
    }),
    FlexLayoutModule,
    AppShellModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
