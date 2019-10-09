/*
 *     The TUMi app provides a modern way of managing events for an esn section.
 *     Copyright (C) 2019  Lukas Heddendorp
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeEn from '@angular/common/locales/en-DE';
import localeEnExtra from '@angular/common/locales/extra/en-DE';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule, FUNCTIONS_ORIGIN, FUNCTIONS_REGION } from '@angular/fire/functions';
import { AngularFirePerformanceModule } from '@angular/fire/performance';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { MarkdownModule } from 'ngx-markdown';
import { environment } from '../environments/environment';
import { AnalyticsErrorHandler } from './AnalyticsErrorHandler';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CartDialogComponent } from './components/cart-dialog/cart-dialog.component';
import { MailSigninComponent } from './components/mail-signin/mail-signin.component';
import { ScanRequestComponent } from './components/scan-request/scan-request.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { PagesModule } from './pages/pages.module';
import { SharedModule } from './shared/shared.module';

registerLocaleData(localeEn, 'en-DE', localeEnExtra);

@NgModule({
  declarations: [AppComponent, NotFoundPageComponent, ScanRequestComponent, MailSigninComponent, CartDialogComponent],
  entryComponents: [ScanRequestComponent, MailSigninComponent, CartDialogComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerImmediately'
    }),
    NgxsModule.forRoot([], { developmentMode: !environment.production }),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production
    }),
    NgxsStoragePluginModule.forRoot(),
    NgxsFormPluginModule.forRoot(),
    // NgxsRouterPluginModule.forRoot(),
    BrowserAnimationsModule,
    FlexLayoutModule,
    MarkdownModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence({ synchronizeTabs: true }),
    AngularFireAuthModule,
    AngularFireFunctionsModule,
    AngularFirePerformanceModule,
    SharedModule,
    PagesModule,
    AppRoutingModule
  ],
  providers: [
    { provide: FUNCTIONS_ORIGIN, useValue: environment.functionsOrigin },
    { provide: FUNCTIONS_REGION, useValue: 'europe-west1' },
    { provide: LOCALE_ID, useValue: 'en-DE' },
    environment.production ? { provide: ErrorHandler, useClass: AnalyticsErrorHandler } : [],
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
