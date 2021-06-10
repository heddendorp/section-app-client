import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@tumi/modules/shared';

import { PagesRoutingModule } from './pages-routing.module';
import {
  DataPrivacyPageComponent,
  ImprintPageComponent,
  InstagramHelperPageComponent,
  NotFoundPageComponent,
  ShopPageComponent,
} from './components';

@NgModule({
  declarations: [
    ShopPageComponent,
    DataPrivacyPageComponent,
    ImprintPageComponent,
    NotFoundPageComponent,
    InstagramHelperPageComponent,
  ],
  imports: [CommonModule, PagesRoutingModule, SharedModule],
  exports: [ImprintPageComponent],
})
export class PagesModule {}
