import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@tumi/modules/shared';

import { ApplicationsRoutingModule } from './applications-routing.module';
import { SelectMethodPageComponent } from './containers/select-method-page/select-method-page.component';
import { NewMemberPageComponent } from './containers/new-member-page/new-member-page.component';
import { FullMemberPageComponent } from './containers/full-member-page/full-member-page.component';
import { SubmittedApplicationsPageComponent } from './containers/submitted-applications-page/submitted-applications-page.component';
import { ManageApplicationsPageComponent } from './containers/manage-applications-page/manage-applications-page.component';
import { ApplicationDetailsPageComponent } from './containers/application-details-page/application-details-page.component';

@NgModule({
  declarations: [
    SelectMethodPageComponent,
    NewMemberPageComponent,
    FullMemberPageComponent,
    SubmittedApplicationsPageComponent,
    ManageApplicationsPageComponent,
    ApplicationDetailsPageComponent,
  ],
  imports: [CommonModule, SharedModule, ApplicationsRoutingModule],
})
export class ApplicationsModule {}
