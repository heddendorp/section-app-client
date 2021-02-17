import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared';

import { AboutRoutingModule } from './about-routing.module';
import { NavigationComponent } from './containers/navigation/navigation.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SosPageComponent } from './pages/sos-page/sos-page.component';
import { TumiPageComponent } from './pages/tumi-page/tumi-page.component';
import { LocalPageComponent } from './pages/local-page/local-page.component';
import { IncomingPageComponent } from './pages/incoming-page/incoming-page.component';

@NgModule({
  declarations: [
    NavigationComponent,
    LandingPageComponent,
    SosPageComponent,
    TumiPageComponent,
    LocalPageComponent,
    IncomingPageComponent,
  ],
  imports: [CommonModule, AboutRoutingModule, SharedModule],
})
export class AboutModule {}
