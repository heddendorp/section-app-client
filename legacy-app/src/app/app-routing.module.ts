import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'events' },
  { path: 'about', pathMatch: 'full', redirectTo: 'page/about' },
  {
    path: 'profile',
    loadChildren: () =>
      import('./modules/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'event-templates',
    loadChildren: () =>
      import('./modules/event-templates/event-templates.module').then(
        (m) => m.EventTemplatesModule
      ),
  },
  {
    path: 'events',
    loadChildren: () =>
      import('./modules/events/events.module').then((m) => m.EventsModule),
  },
  {
    path: 'tenant',
    loadChildren: () =>
      import('./modules/tenant/tenant.module').then((m) => m.TenantModule),
  },
  {
    path: 'page',
    loadChildren: () =>
      import('./modules/page/page.module').then((m) => m.PageModule),
  },
  {
    path: 'shop',
    loadChildren: () =>
      import('./modules/shop/shop.module').then((m) => m.ShopModule),
  },
  {
    path: 'basket',
    loadChildren: () =>
      import('./modules/shopping-basket/shopping-basket.module').then(
        (m) => m.ShoppingBasketModule
      ),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
