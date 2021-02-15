import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared';

import { AboutRoutingModule } from './about-routing.module';
import { NavigationComponent } from './containers/navigation/navigation.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { FaqPageComponent } from './pages/faq-page/faq-page.component';
import { SosPageComponent } from './pages/sos-page/sos-page.component';

@NgModule({
  declarations: [
    NavigationComponent,
    LandingPageComponent,
    FaqPageComponent,
    SosPageComponent,
  ],
  imports: [CommonModule, AboutRoutingModule, SharedModule],
})
export class AboutModule {}
