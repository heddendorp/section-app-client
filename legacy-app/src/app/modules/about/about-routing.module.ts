import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationComponent } from '@tumi/modules/about/containers/navigation/navigation.component';
import { LandingPageComponent } from '@tumi/modules/about/pages/landing-page/landing-page.component';
import { SosPageComponent } from '@tumi/modules/about/pages/sos-page/sos-page.component';
import { IncomingPageComponent } from './pages/incoming-page/incoming-page.component';
import { LocalPageComponent } from './pages/local-page/local-page.component';
import { TumiPageComponent } from './pages/tumi-page/tumi-page.component';

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
      { path: 'sos', component: SosPageComponent },
      { path: 'tumi', component: TumiPageComponent },
      { path: 'incoming', component: IncomingPageComponent },
      { path: 'local', component: LocalPageComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AboutRoutingModule {}
