import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberDashboardPageComponent } from './pages/member-dashboard-page/member-dashboard-page.component';

const routes: Routes = [{ path: '', component: MemberDashboardPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MembersRoutingModule {}
