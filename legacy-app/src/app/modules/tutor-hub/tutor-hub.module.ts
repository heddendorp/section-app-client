import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TutorHubRoutingModule } from './tutor-hub-routing.module';
import { TutorHubComponent } from './tutor-hub.component';
import { SharedModule } from '../shared/shared.module';
import { MatRippleModule } from '@angular/material/core';
import { SemesterNavigatorComponent } from './semester-navigator/semester-navigator.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TutorHubComponent, SemesterNavigatorComponent],
  imports: [CommonModule, TutorHubRoutingModule, SharedModule, 
    MatRippleModule, ReactiveFormsModule],
})
export class TutorHubModule {}
