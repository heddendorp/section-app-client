import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullMemberPageComponent } from '@tumi/modules/applications/containers/full-member-page/full-member-page.component';
import { NewMemberPageComponent } from '@tumi/modules/applications/containers/new-member-page/new-member-page.component';
import { SelectMethodPageComponent } from '@tumi/modules/applications/containers/select-method-page/select-method-page.component';
import { SubmittedApplicationsPageComponent } from '@tumi/modules/applications/containers/submitted-applications-page/submitted-applications-page.component';
import { IsAuthenticatedGuard } from '@tumi/modules/applications/guards/is-authenticated.guard';

const routes: Routes = [
  { path: '', component: SelectMethodPageComponent },
  {
    path: 'new',
    canActivate: [IsAuthenticatedGuard],
    component: NewMemberPageComponent,
  },
  {
    path: 'submitted',
    canActivate: [IsAuthenticatedGuard],
    component: SubmittedApplicationsPageComponent,
  },
  { path: 'full', component: FullMemberPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationsRoutingModule {}
