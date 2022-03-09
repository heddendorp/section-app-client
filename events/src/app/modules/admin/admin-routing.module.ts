import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardPageComponent } from './pages/admin-dashboard-page/admin-dashboard-page.component';
import { AdminInvitesPageComponent } from './pages/admin-invites-page/admin-invites-page.component';
import { AdminInvitesCreatePageComponent } from './pages/admin-invites-create-page/admin-invites-create-page.component';

const routes: Routes = [
  { path: '', component: AdminDashboardPageComponent },
  { path: 'invites', component: AdminInvitesPageComponent },
  { path: 'invites/create', component: AdminInvitesCreatePageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
