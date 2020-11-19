import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MoneyComponent } from './money.component';

const routes: Routes = [{ path: '', component: MoneyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoneyRoutingModule {}
