import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardPageComponent } from './pages/admin-dashboard-page/admin-dashboard-page.component';
import { AdminInvitesPageComponent } from './pages/admin-invites-page/admin-invites-page.component';
import { SharedModule } from '../shared/shared.module';
import { AdminInvitesCreatePageComponent } from './pages/admin-invites-create-page/admin-invites-create-page.component';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AdminDashboardPageComponent,
    AdminInvitesPageComponent,
    AdminInvitesCreatePageComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
  ],
})
export class AdminModule {}
