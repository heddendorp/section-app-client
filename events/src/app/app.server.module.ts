import { NgModule } from '@angular/core';
import {
  ServerModule,
  ServerTransferStateModule,
} from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { UniversalModule } from '@ng-web-apis/universal';
import { AuthService } from '@auth0/auth0-angular';
import { AuthShim } from './shims/authShim';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
    UniversalModule,
  ],
  bootstrap: [AppComponent],
  providers: [{ provide: AuthService, useClass: AuthShim }],
})
export class AppServerModule {}
