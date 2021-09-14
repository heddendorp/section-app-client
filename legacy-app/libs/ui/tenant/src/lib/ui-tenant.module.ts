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

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: TenantLandingPageComponent },
      { path: 'organizers', component: TenantOrganizersPageComponent },
    ]),
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatListModule,
  ],
  declarations: [
    TenantLandingPageComponent,
    TenantOrganizersPageComponent,
    NewOrganizerDialogComponent,
  ],
})
export class UiTenantModule {}
