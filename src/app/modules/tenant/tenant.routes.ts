import { Routes } from '@angular/router';
import { TenantLandingPageComponent } from '@tumi/legacy-app/modules/tenant/pages/tenant-landing-page/tenant-landing-page.component';
import { TenantOrganizersPageComponent } from '@tumi/legacy-app/modules/tenant/pages/tenant-organizers-page/tenant-organizers-page.component';
import { TenantUsersPageComponent } from '@tumi/legacy-app/modules/tenant/pages/tenant-users-page/tenant-users-page.component';
import { TenantUserInfoPageComponent } from '@tumi/legacy-app/modules/tenant/pages/tenant-user-info-page/tenant-user-info-page.component';
import { TenantRegistrationsPageComponent } from '@tumi/legacy-app/modules/tenant/pages/registrations/tenant-registrations-page/tenant-registrations-page.component';
import { TenantRegistrationDetailsPageComponent } from '@tumi/legacy-app/modules/tenant/pages/registrations/tenant-registration-details-page/tenant-registration-details-page.component';
import { TenantMoveOrdersPageComponent } from '@tumi/legacy-app/modules/tenant/pages/registrations/tenant-move-orders-page/tenant-move-orders-page.component';
import { TenantRegistrationCodePageComponent } from '@tumi/legacy-app/modules/tenant/pages/registrations/tenant-registration-code-page/tenant-registration-code-page.component';
import { TenantEditPageComponent } from '@tumi/legacy-app/modules/tenant/pages/tenant-edit-page/tenant-edit-page.component';
import { TenantStatsPageComponent } from '@tumi/legacy-app/modules/tenant/pages/tenant-stats-page/tenant-stats-page.component';
import { TenantPhotosPageComponent } from '@tumi/legacy-app/modules/tenant/pages/tenant-photos-page/tenant-photos-page.component';
import { TenantEventRatingsComponent } from '@tumi/legacy-app/modules/tenant/pages/events/tenant-event-ratings/tenant-event-ratings.component';
import { TenantEventBookingsPageComponent } from '@tumi/legacy-app/modules/tenant/pages/events/tenant-event-bookings-page/tenant-event-bookings-page.component';
import { TenantEventsPageComponent } from '@tumi/legacy-app/modules/tenant/pages/events/tenant-events-page/tenant-events-page.component';
import { TenantEventTemplateCategoriesPageComponent } from '@tumi/legacy-app/modules/tenant/pages/events/tenant-event-template-categories-page/tenant-event-template-categories-page.component';
import { TenantMetricsPageComponent } from '@tumi/legacy-app/modules/tenant/pages/tenant-metrics-page/tenant-metrics-page.component';
import { TenantTransactionsPageComponent } from '@tumi/legacy-app/modules/tenant/pages/tenant-transactions-page/tenant-transactions-page.component';

export const TENANT_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: TenantLandingPageComponent,
    title: 'Tenant',
  },
  {
    path: 'organizers',
    component: TenantOrganizersPageComponent,
    title: 'Organizers',
  },
  { path: 'users', component: TenantUsersPageComponent, title: 'Users' },
  {
    path: 'users/:userId',
    component: TenantUserInfoPageComponent,
    title: 'User Details',
  },
  {
    path: 'registrations',
    component: TenantRegistrationsPageComponent,
    title: 'Registrations',
  },
  {
    path: 'registrations/:registrationId',
    component: TenantRegistrationDetailsPageComponent,
    title: 'Registration Details',
  },
  {
    path: 'codes',
    component: TenantMoveOrdersPageComponent,
    title: 'Registration Codes',
  },
  {
    path: 'codes/:codeId',
    component: TenantRegistrationCodePageComponent,
    title: 'Registration Code',
  },
  { path: 'edit', component: TenantEditPageComponent, title: 'Edit tenant' },
  { path: 'stats', component: TenantStatsPageComponent, title: 'Stats' },
  { path: 'photos', component: TenantPhotosPageComponent, title: 'Photos' },
  {
    path: 'ratings',
    component: TenantEventRatingsComponent,
    title: 'Event Ratings',
  },
  {
    path: 'bookings',
    component: TenantEventBookingsPageComponent,
    title: 'Event Bookings',
  },
  { path: 'events', component: TenantEventsPageComponent },
  {
    path: 'event-template-categories',
    component: TenantEventTemplateCategoriesPageComponent,
    title: 'Event Template Categories',
  },
  { path: 'metrics', component: TenantMetricsPageComponent, title: 'Metrics' },
  {
    path: 'transactions',
    component: TenantTransactionsPageComponent,
    title: 'Transactions',
  },
];
