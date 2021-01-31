import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationDetailsPageComponent } from '@tumi/modules/applications/containers/application-details-page/application-details-page.component';
import { FullMemberPageComponent } from '@tumi/modules/applications/containers/full-member-page/full-member-page.component';
import { ManageApplicationsPageComponent } from '@tumi/modules/applications/containers/manage-applications-page/manage-applications-page.component';
import { NewMemberPageComponent } from '@tumi/modules/applications/containers/new-member-page/new-member-page.component';
import { SelectMethodPageComponent } from '@tumi/modules/applications/containers/select-method-page/select-method-page.component';
import { SubmittedApplicationsPageComponent } from '@tumi/modules/applications/containers/submitted-applications-page/submitted-applications-page.component';
import { IsAuthenticatedGuard } from '@tumi/modules/applications/guards/is-authenticated.guard';
import { ApplicationResolver } from '@tumi/modules/applications/resolvers/application.resolver';

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
  {
    path: 'manage',
    canActivate: [IsAuthenticatedGuard],
    component: ManageApplicationsPageComponent,
  },
  {
    path: 'manage/:applicationId',
    canActivate: [IsAuthenticatedGuard],
    resolve: { application: ApplicationResolver },
    component: ApplicationDetailsPageComponent,
  },
  { path: 'full', component: FullMemberPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationsRoutingModule {}
