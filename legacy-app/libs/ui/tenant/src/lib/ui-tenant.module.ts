import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TenantLandingPageComponent } from './pages/tenant-landing-page/tenant-landing-page.component';
import { TenantOrganizersPageComponent } from './pages/tenant-organizers-page/tenant-organizers-page.component';
import { MatButtonModule } from '@angular/material/button';
import { NewOrganizerDialogComponent } from './components/new-organizer-dialog/new-organizer-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { TenantUsersPageComponent } from './pages/tenant-users-page/tenant-users-page.component';
import { MatTableModule } from '@angular/material/table';
import { UpdateUserDialogComponent } from './components/update-user-dialog/update-user-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { TenantRegistrationsPageComponent } from './pages/tenant-registrations-page/tenant-registrations-page.component';
import { TenantRefundsPageComponent } from './pages/tenant-refunds-page/tenant-refunds-page.component';
import { TenantEditPageComponent } from './pages/tenant-edit-page/tenant-edit-page.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: TenantLandingPageComponent },
      { path: 'organizers', component: TenantOrganizersPageComponent },
      { path: 'users', component: TenantUsersPageComponent },
      { path: 'registrations', component: TenantRegistrationsPageComponent },
      { path: 'refunds', component: TenantRefundsPageComponent },
      { path: 'edit', component: TenantEditPageComponent },
    ]),
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatListModule,
    MatTableModule,
    MatSelectModule,
  ],
  declarations: [
    TenantLandingPageComponent,
    TenantOrganizersPageComponent,
    NewOrganizerDialogComponent,
    TenantUsersPageComponent,
    UpdateUserDialogComponent,
    TenantRegistrationsPageComponent,
    TenantRefundsPageComponent,
    TenantEditPageComponent,
  ],
})
export class UiTenantModule {}
