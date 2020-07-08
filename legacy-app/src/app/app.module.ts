/*
 *     The TUMi app provides a modern way of managing events for an esn section.
 *     Copyright (C) 2020  Lukas Heddendorp
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
import localeEn from '@angular/common/locales/en-DE';
import localeEnExtra from '@angular/common/locales/extra/en-DE';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import {
  AngularFireAnalytics,
  AngularFireAnalyticsModule,
  APP_NAME,
  APP_VERSION,
  COLLECTION_ENABLED,
  CONFIG,
  DEBUG_MODE,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule, ORIGIN, REGION } from '@angular/fire/functions';
import { AngularFirePerformanceModule } from '@angular/fire/performance';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import * as moment from 'moment';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { version } from '../../package.json';
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
import { migration1 } from './storageMigrations';

registerLocaleData(localeEn, 'en-DE', localeEnExtra);
const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.{0,1}\d*))(?:Z|(\+|-)([\d|:]*))?$/;

@NgModule({
  declarations: [AppComponent, NotFoundPageComponent, ScanRequestComponent, MailSigninComponent, CartDialogComponent],
  entryComponents: [ScanRequestComponent, MailSigninComponent, CartDialogComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerImmediately',
    }),
    NgxsModule.forRoot([], { developmentMode: false }),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production,
    }),
    NgxsStoragePluginModule.forRoot({
      deserialize(obj: any): any {
        return JSON.parse(obj, (key, value) => {
          if (typeof value === 'string') {
            const test = reISO.exec(value);
            if (test) {
              return moment(value).clone();
            }
          }
          return value;
        });
      },
      migrations: [
        {
          version: 1,
          key: 'users',
          migrate: migration1,
        },
      ],
    }),
    NgxsFormPluginModule.forRoot(),
    // NgxsRouterPluginModule.forRoot(),
    BrowserAnimationsModule,
    FlexLayoutModule,
    MarkdownModule.forRoot({
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          gfm: true,
          tables: true,
          breaks: false,
          pedantic: false,
          sanitize: false,
          smartLists: true,
          smartypants: true,
        },
      },
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirestoreModule.enablePersistence({ synchronizeTabs: true }),
    AngularFireAuthModule,
    AngularFireFunctionsModule,
    AngularFirePerformanceModule,
    SharedModule,
    PagesModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: ORIGIN, useValue: environment.functionsOrigin },
    { provide: REGION, useValue: 'europe-west1' },
    {
      provide: CONFIG,
      useValue: {
        anonymize_ip: true,
      },
    },
    { provide: COLLECTION_ENABLED, useValue: localStorage.getItem('disableAnalytics') || false },
    { provide: DEBUG_MODE, useValue: localStorage.getItem('@@debug') || false },
    { provide: APP_VERSION, useValue: version },
    { provide: APP_NAME, useValue: 'esn-tumi' },
    environment.production ? { provide: ErrorHandler, useClass: AnalyticsErrorHandler } : [],
    ScreenTrackingService,
    UserTrackingService,
    Title,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(angularFireAuth: AngularFireAuth, private router: Router, analytics: AngularFireAnalytics) {
    angularFireAuth.getRedirectResult().then((result) => {
      if (result.user) {
        console.log(result.user);
        analytics.setUserProperties(result.user);
        if (!location.pathname.includes('pa-register')) {
          this.router.navigate(['/']);
        }
      }
    });
  }
}
