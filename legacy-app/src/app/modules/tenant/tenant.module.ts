import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TenantRoutingModule } from './tenant-routing.module';
import { NewOrganizerDialogComponent } from './components/new-organizer-dialog/new-organizer-dialog.component';
import { ShowDataDialogComponent } from './components/show-data-dialog/show-data-dialog.component';
import { UpdateUserDialogComponent } from './components/update-user-dialog/update-user-dialog.component';
import { SharedModule } from '@tumi/legacy-app/modules/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TenantRegistrationCodePageComponent } from './pages/registrations/tenant-registration-code-page/tenant-registration-code-page.component';
import { TenantRegistrationsPageComponent } from './pages/registrations/tenant-registrations-page/tenant-registrations-page.component';
import { TenantMoveOrdersPageComponent } from './pages/registrations/tenant-move-orders-page/tenant-move-orders-page.component';
import { TenantRegistrationDetailsPageComponent } from './pages/registrations/tenant-registration-details-page/tenant-registration-details-page.component';
import { TenantActivityLogPageComponent } from './pages/tenant-activity-log-page/tenant-activity-log-page.component';
import { TenantEditPageComponent } from './pages/tenant-edit-page/tenant-edit-page.component';
import { TenantInsurancePageComponent } from './pages/tenant-insurance-page/tenant-insurance-page.component';
import { TenantLandingPageComponent } from './pages/tenant-landing-page/tenant-landing-page.component';
import { TenantPhotosPageComponent } from './pages/tenant-photos-page/tenant-photos-page.component';
import { TenantPurchaseDetailsPageComponent } from './pages/tenant-purchase-details-page/tenant-purchase-details-page.component';
import { TenantPurchasesPageComponent } from './pages/tenant-purchases-page/tenant-purchases-page.component';
import { TenantStatsPageComponent } from './pages/tenant-stats-page/tenant-stats-page.component';
import { TenantUserInfoPageComponent } from './pages/tenant-user-info-page/tenant-user-info-page.component';
import { TenantUsersPageComponent } from './pages/tenant-users-page/tenant-users-page.component';
import { TenantOrganizersPageComponent } from './pages/tenant-organizers-page/tenant-organizers-page.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { TenantRefundsPageComponent } from './pages/tenant-refunds-page/tenant-refunds-page.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TenantEventRatingsComponent } from './pages/tenant-event-ratings/tenant-event-ratings.component';
import { TenantEventBookingsPageComponent } from './pages/tenant-event-bookings-page/tenant-event-bookings-page.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TenantMetricsPageComponent } from './pages/tenant-metrics-page/tenant-metrics-page.component';
import { TenantEventTemplateCategoriesPageComponent } from './pages/tenant-event-template-categories-page/tenant-event-template-categories-page.component';
import { NewEventTemplateCategoryDialogComponent } from './components/new-event-template-category-dialog/new-event-template-category-dialog.component';
import { TenantTransactionsPageComponent } from './pages/tenant-transactions-page/tenant-transactions-page.component';

@NgModule({
  declarations: [
    NewOrganizerDialogComponent,
    ShowDataDialogComponent,
    TenantActivityLogPageComponent,
    TenantEditPageComponent,
    TenantInsurancePageComponent,
    TenantLandingPageComponent,
    TenantMoveOrdersPageComponent,
    TenantOrganizersPageComponent,
    TenantPhotosPageComponent,
    TenantPurchaseDetailsPageComponent,
    TenantPurchasesPageComponent,
    TenantRefundsPageComponent,
    TenantRegistrationCodePageComponent,
    TenantRegistrationDetailsPageComponent,
    TenantRegistrationsPageComponent,
    TenantStatsPageComponent,
    TenantUserInfoPageComponent,
    TenantUsersPageComponent,
    UpdateUserDialogComponent,
    TenantEventRatingsComponent,
    TenantEventBookingsPageComponent,
    TenantMetricsPageComponent,
    TenantEventTemplateCategoriesPageComponent,
    NewEventTemplateCategoryDialogComponent,
    TenantTransactionsPageComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatTableModule,
    HighchartsChartModule,
    ReactiveFormsModule,
    SharedModule,
    TenantRoutingModule,
    MatDatepickerModule,
  ],
})
export class TenantModule {}
