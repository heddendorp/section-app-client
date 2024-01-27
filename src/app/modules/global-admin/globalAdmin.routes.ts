import { Routes } from '@angular/router';

export const GLOBAL_ADMIN_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'fees' },
  {
    path: 'fees',
    loadComponent: () =>
      import('./fee-overview/fee-overview.component').then(
        (m) => m.FeeOverviewComponent,
      ),
  },
];
