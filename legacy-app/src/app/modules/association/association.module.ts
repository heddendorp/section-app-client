import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@tumi/modules/shared';

import { AssociationRoutingModule } from './association-routing.module';
import { MemberListPageComponent } from './containers/member-list-page/member-list-page.component';
import { MemberDetailsPageComponent } from './containers/member-details-page/member-details-page.component';
import { MemberFunctionsComponent } from './components/member-functions/member-functions.component';

@NgModule({
  declarations: [
    MemberListPageComponent,
    MemberDetailsPageComponent,
    MemberFunctionsComponent,
  ],
  imports: [CommonModule, SharedModule, AssociationRoutingModule],
})
export class AssociationModule {}
