import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  DataPrivacyPageComponent,
  ImprintPageComponent,
  NotFoundPageComponent,
  ShopPageComponent,
} from '@tumi/modules/pages/components';
import { IsntagramHelperComponent } from "@tumi/modules/pages/components/isntagram-helper/isntagram-helper.component";

const routes: Routes = [
  { path: 'shop', component: ShopPageComponent },
  { path: 'privacy', component: DataPrivacyPageComponent },
  { path: 'imprint', component: ImprintPageComponent },
  { path: 'not-found', component: NotFoundPageComponent },
  { path: 'insta', component: IsntagramHelperComponent },
  { path: '', pathMatch: 'full', redirectTo: 'shop' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
