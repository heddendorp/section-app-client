import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@tumi/modules/shared';

import { PagesRoutingModule } from './pages-routing.module';
import { ShopPageComponent } from './components/shop-page/shop-page.component';
import { DataPrivacyPageComponent } from './components/data-privacy-page/data-privacy-page.component';
import { ImprintPageComponent } from './components/imprint-page/imprint-page.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';

@NgModule({
  declarations: [
    ShopPageComponent,
    DataPrivacyPageComponent,
    ImprintPageComponent,
    NotFoundPageComponent,
  ],
  imports: [CommonModule, PagesRoutingModule, SharedModule],
  exports: [ImprintPageComponent],
})
export class PagesModule {}
