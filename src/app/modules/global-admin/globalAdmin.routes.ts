import { Routes } from '@angular/router';

export const GLOBAL_ADMIN_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./global-admin-langing/global-admin-langing.component').then(
        (m) => m.GlobalAdminLangingComponent,
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
];
