import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MembersRoutingModule } from './members-routing.module';
import { MemberDashboardPageComponent } from './pages/member-dashboard-page/member-dashboard-page.component';
import { MembershipStatusComponent } from './components/membership-status/membership-status.component';

@NgModule({
  declarations: [MemberDashboardPageComponent, MembershipStatusComponent],
  imports: [CommonModule, MembersRoutingModule],
})
export class MembersModule {}
