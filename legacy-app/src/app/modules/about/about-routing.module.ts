import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationComponent } from '@tumi/modules/about/containers/navigation/navigation.component';
import { FaqPageComponent } from '@tumi/modules/about/pages/faq-page/faq-page.component';
import { LandingPageComponent } from '@tumi/modules/about/pages/landing-page/landing-page.component';
import { SosPageComponent } from '@tumi/modules/about/pages/sos-page/sos-page.component';

const routes: Routes = [
  {
    path: '',
    component: NavigationComponent,
    children: [
      {
        path: '',
        component: LandingPageComponent,
        data: { navigationMode: 'landing' },
      },
      { path: 'faq', component: FaqPageComponent },
      { path: 'sos', component: SosPageComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AboutRoutingModule {}
