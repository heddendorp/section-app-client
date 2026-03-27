import { Routes } from '@angular/router';

export const GLOBAL_ADMIN_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('@tumi/legacy-app/modules/global-admin/global-admin-landing/global-admin-landing.component').then(
        (m) => m.GlobalAdminLandingComponent,
      ),
  },
  {
    path: 'statistics',
    loadComponent: () =>
      import('./global-statistics/global-statistics.component').then(
        (m) => m.GlobalStatisticsComponent,
      ),
  },
  {
    path: 'fees',
    loadComponent: () =>
      import('./fee-overview/fee-overview.component').then(
        (m) => m.FeeOverviewComponent,
      ),
  },
  {
    path: 'invoices',
    loadComponent: () =>
      import('./invoices/invoices.component').then((m) => m.InvoicesComponent),
  },
  {
    path: 'tenants',
    loadComponent: () =>
      import('./tenants/tenants.component').then((m) => m.TenantsComponent),
  },
];
