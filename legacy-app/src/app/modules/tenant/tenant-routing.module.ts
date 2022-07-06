import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantPurchaseDetailsPageComponent } from '@tumi/legacy-app/modules/tenant/pages/tenant-purchase-details-page/tenant-purchase-details-page.component';
import { TenantPhotosPageComponent } from '@tumi/legacy-app/modules/tenant/pages/tenant-photos-page/tenant-photos-page.component';
import { TenantPurchasesPageComponent } from '@tumi/legacy-app/modules/tenant/pages/tenant-purchases-page/tenant-purchases-page.component';
import { TenantStatsPageComponent } from '@tumi/legacy-app/modules/tenant/pages/tenant-stats-page/tenant-stats-page.component';
import { TenantUsersPageComponent } from '@tumi/legacy-app/modules/tenant/pages/tenant-users-page/tenant-users-page.component';
import { TenantInsurancePageComponent } from '@tumi/legacy-app/modules/tenant/pages/tenant-insurance-page/tenant-insurance-page.component';
import { TenantUserInfoPageComponent } from '@tumi/legacy-app/modules/tenant/pages/tenant-user-info-page/tenant-user-info-page.component';
import { TenantMoveOrdersPageComponent } from '@tumi/legacy-app/modules/tenant/pages/registrations/tenant-move-orders-page/tenant-move-orders-page.component';
import { TenantActivityLogPageComponent } from '@tumi/legacy-app/modules/tenant/pages/tenant-activity-log-page/tenant-activity-log-page.component';
import { TenantRegistrationDetailsPageComponent } from '@tumi/legacy-app/modules/tenant/pages/registrations/tenant-registration-details-page/tenant-registration-details-page.component';
import { TenantLandingPageComponent } from '@tumi/legacy-app/modules/tenant/pages/tenant-landing-page/tenant-landing-page.component';
import { TenantRegistrationCodePageComponent } from '@tumi/legacy-app/modules/tenant/pages/registrations/tenant-registration-code-page/tenant-registration-code-page.component';
import { TenantRegistrationsPageComponent } from '@tumi/legacy-app/modules/tenant/pages/registrations/tenant-registrations-page/tenant-registrations-page.component';
import { TenantEditPageComponent } from '@tumi/legacy-app/modules/tenant/pages/tenant-edit-page/tenant-edit-page.component';
import { TenantOrganizersPageComponent } from '@tumi/legacy-app/modules/tenant/pages/tenant-organizers-page/tenant-organizers-page.component';
import { TenantEventRatingsComponent } from '@tumi/legacy-app/modules/tenant/pages/tenant-event-ratings/tenant-event-ratings.component';
import { TenantEventBookingsPageComponent } from '@tumi/legacy-app/modules/tenant/pages/tenant-event-bookings-page/tenant-event-bookings-page.component';
import { TenantMetricsPageComponent } from '@tumi/legacy-app/modules/tenant/pages/tenant-metrics-page/tenant-metrics-page.component';
import { TenantEventTemplateCategoriesPageComponent } from '@tumi/legacy-app/modules/tenant/pages/tenant-event-template-categories-page/tenant-event-template-categories-page.component';
import { TenantTransactionsPageComponent } from '@tumi/legacy-app/modules/tenant/pages/tenant-transactions-page/tenant-transactions-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: TenantLandingPageComponent },
  { path: 'organizers', component: TenantOrganizersPageComponent },
  { path: 'users', component: TenantUsersPageComponent },
  { path: 'users/:userId', component: TenantUserInfoPageComponent },
  { path: 'registrations', component: TenantRegistrationsPageComponent },
  {
    path: 'registrations/:registrationId',
    component: TenantRegistrationDetailsPageComponent,
  },
  { path: 'codes', component: TenantMoveOrdersPageComponent },
  { path: 'codes/:codeId', component: TenantRegistrationCodePageComponent },
  // { path: 'refunds', component: TenantRefundsPageComponent },
  { path: 'edit', component: TenantEditPageComponent },
  { path: 'stats', component: TenantStatsPageComponent },
  { path: 'logs', component: TenantActivityLogPageComponent },
  { path: 'photos', component: TenantPhotosPageComponent },
  { path: 'purchases', component: TenantPurchasesPageComponent },
  { path: 'insurance', component: TenantInsurancePageComponent },
  { path: 'ratings', component: TenantEventRatingsComponent },
  { path: 'bookings', component: TenantEventBookingsPageComponent },
  {
    path: 'event-template-categories',
    component: TenantEventTemplateCategoriesPageComponent,
  },
  { path: 'metrics', component: TenantMetricsPageComponent },
  { path: 'transactions', component: TenantTransactionsPageComponent },
  {
    path: 'purchases/:purchaseId',
    component: TenantPurchaseDetailsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TenantRoutingModule {}
