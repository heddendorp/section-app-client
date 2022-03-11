import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InviteComponent } from './invite.component';
import { InviteAuthGuard } from './guards/invite-auth.guard';

const routes: Routes = [
  {
    path: ':id',
    canActivate: [InviteAuthGuard],
    component: InviteComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InviteRoutingModule {}
