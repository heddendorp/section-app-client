import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstagramComponent } from './instagram.component';

const routes: Routes = [{ path: '', component: InstagramComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstagramRoutingModule { }
