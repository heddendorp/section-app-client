import { NgModule } from '@angular/core';
import { FlexLayoutServerModule } from '@angular/flex-layout/server';
import {
  ServerModule,
  ServerTransferStateModule,
} from '@angular/platform-server';
import { SwRegistrationOptions } from '@angular/service-worker';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
    FlexLayoutServerModule,
  ],
  bootstrap: [AppComponent],
  providers: [{ provide: SwRegistrationOptions, useValue: { enable: false } }],
})
export class AppServerModule {}
