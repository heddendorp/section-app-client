import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TutorHubComponent } from './tutor-hub.component';

const routes: Routes = [{ path: '', component: TutorHubComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TutorHubRoutingModule {}
