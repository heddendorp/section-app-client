import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoicesPageComponent } from '@tumi/modules/association/containers/invoices-page/invoices-page.component';
import { MemberDetailsPageComponent } from '@tumi/modules/association/containers/member-details-page/member-details-page.component';
import { MemberListPageComponent } from '@tumi/modules/association/containers/member-list-page/member-list-page.component';

const routes: Routes = [
  { path: 'members', component: MemberListPageComponent },
  { path: 'invoices', component: InvoicesPageComponent },
  { path: 'members/:userId', component: MemberDetailsPageComponent },
  { path: '', redirectTo: 'members' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssociationRoutingModule {}
