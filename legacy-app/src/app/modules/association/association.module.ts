import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@tumi/modules/shared';

import { AssociationRoutingModule } from './association-routing.module';
import { MemberListPageComponent } from './containers/member-list-page/member-list-page.component';
import { MemberDetailsPageComponent } from './containers/member-details-page/member-details-page.component';
import { MemberFunctionsComponent } from './components/member-functions/member-functions.component';
import { InvoicesPageComponent } from './containers/invoices-page/invoices-page.component';
import { MemberInvoiceInfoComponent } from './components/member-invoice-info/member-invoice-info.component';

@NgModule({
  declarations: [
    MemberListPageComponent,
    MemberDetailsPageComponent,
    MemberFunctionsComponent,
    InvoicesPageComponent,
    MemberInvoiceInfoComponent,
  ],
  imports: [CommonModule, SharedModule, AssociationRoutingModule],
})
export class AssociationModule {}
