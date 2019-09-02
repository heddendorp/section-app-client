import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PagesModule } from './pages/pages.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFirePerformanceModule } from '@angular/fire/performance';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { AngularFireFunctionsModule, FUNCTIONS_ORIGIN } from '@angular/fire/functions';
import { ScanRequestComponent } from './components/scan-request/scan-request.component';
import { MailSigninComponent } from './components/mail-signin/mail-signin.component';

@NgModule({
  declarations: [AppComponent, NotFoundPageComponent, ScanRequestComponent, MailSigninComponent],
  entryComponents: [ScanRequestComponent, MailSigninComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerImmediately'
    }),
    BrowserAnimationsModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence({ synchronizeTabs: true }),
    AngularFireAuthModule,
    AngularFireFunctionsModule,
    AngularFirePerformanceModule,
    SharedModule,
    PagesModule,
    AppRoutingModule
  ],
  providers: [{ provide: FUNCTIONS_ORIGIN, useValue: environment.functionsOrigin }],
  bootstrap: [AppComponent]
})
export class AppModule {}
