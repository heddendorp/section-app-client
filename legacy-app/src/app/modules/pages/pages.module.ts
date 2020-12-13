import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@tumi/modules/shared';

import { PagesRoutingModule } from './pages-routing.module';
import { ShopPageComponent } from './components/shop-page/shop-page.component';

@NgModule({
  declarations: [ShopPageComponent],
  imports: [CommonModule, PagesRoutingModule, SharedModule],
})
export class PagesModule {}
