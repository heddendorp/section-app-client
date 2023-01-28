import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from '@tumi/legacy-app/modules/shared/shared.module';
import { TumiHomeComponent } from './components/tumi-home/tumi-home.component';
import { AugsburgHomeComponent } from './components/augsburg-home/augsburg-home.component';
import { TechnicalSupportComponent } from './components/technical-support/technical-support.component';

@NgModule({
  declarations: [HomeComponent, TumiHomeComponent, AugsburgHomeComponent, TechnicalSupportComponent],
  imports: [CommonModule, HomeRoutingModule, SharedModule],
})
export class HomeModule {}
