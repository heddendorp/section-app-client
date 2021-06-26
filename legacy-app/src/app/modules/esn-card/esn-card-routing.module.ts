import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EsnCardComponent } from './esn-card.component';

const routes: Routes = [{ path: '', component: EsnCardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EsnCardRoutingModule { }
