import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShopPageComponent } from '@tumi/modules/pages/components/shop-page/shop-page.component';

const routes: Routes = [
  { path: 'shop', component: ShopPageComponent },
  { path: '', pathMatch: 'full', redirectTo: 'shop' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
