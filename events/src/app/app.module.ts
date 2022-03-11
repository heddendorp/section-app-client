import { NgModule } from '@angular/core';
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
import { MatSidenavModule } from '@angular/material/sidenav';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

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
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'fill' },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
