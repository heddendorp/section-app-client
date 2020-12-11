import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AngularFirePerformanceModule } from '@angular/fire/performance';
import {
  AngularFireAnalyticsModule,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import {
  ServiceWorkerModule,
  SwRegistrationOptions,
} from '@angular/service-worker';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { environment } from '@tumi/environments/environment';
import {
  EmailLoginDialogComponent,
  LoginOptionsDialogComponent,
  NavigationComponent,
} from '@tumi/components';
import { SharedModule } from '@tumi/modules/shared';
import { MoveUrlDialogComponent } from './components/move-url-dialog/move-url-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    LoginOptionsDialogComponent,
    EmailLoginDialogComponent,
    MoveUrlDialogComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence({ synchronizeTabs: true }),
    AngularFireAnalyticsModule,
    AngularFirePerformanceModule,
    AngularFireFunctionsModule,
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
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js'),
    SharedModule,
  ],
  providers: [
    ScreenTrackingService,
    UserTrackingService,
    {
      provide: SwRegistrationOptions,
      useFactory: () => ({ enabled: location.host.includes('esn.world') }),
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
