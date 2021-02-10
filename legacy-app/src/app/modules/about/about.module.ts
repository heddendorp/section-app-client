import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@tumi/modules/shared';

import { AboutRoutingModule } from './about-routing.module';
import { NavigationComponent } from './containers/navigation/navigation.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { ForStudentsPageComponent } from './pages/for-students-page/for-students-page.component';
import { FaqPageComponent } from './pages/faq-page/faq-page.component';
import { ForInterestedPageComponent } from './pages/for-interested-page/for-interested-page.component';
import { SosPageComponent } from './pages/sos-page/sos-page.component';

@NgModule({
  declarations: [
    NavigationComponent,
    LandingPageComponent,
    ForStudentsPageComponent,
    FaqPageComponent,
    ForInterestedPageComponent,
    SosPageComponent,
  ],
  imports: [CommonModule, AboutRoutingModule, SharedModule],
})
export class AboutModule {}
