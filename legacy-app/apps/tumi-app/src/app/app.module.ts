import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from '@auth0/auth0-angular';
import {FlexLayoutModule} from '@angular/flex-layout'
import {AppShellModule} from '@tumi/app-shell'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    AuthModule.forRoot({
      domain: 'tumi.eu.auth0.com',
      clientId: '9HrqRBDGhlb6P3NsYKmTbTOVGTv5ZgG8',
    }),
    FlexLayoutModule,
    AppShellModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
