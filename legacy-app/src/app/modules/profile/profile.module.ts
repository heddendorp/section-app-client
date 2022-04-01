import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ClaimEventDialogComponent } from './components/claim-event-dialog/claim-event-dialog.component';
import { UpdateProfileDialogComponent } from './components/update-profile-dialog/update-profile-dialog.component';
import { NewUserPageComponent } from './pages/new-user-page/new-user-page.component';
import { PhotoJourneyPageComponent } from './pages/photo-journey-page/photo-journey-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { SharedModule } from '@tumi/legacy-app/modules/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { RatingComponent } from './components/rating/rating.component';
import { RateEventComponent } from './components/rate-event/rate-event.component';

@NgModule({
  declarations: [
    ClaimEventDialogComponent,
    UpdateProfileDialogComponent,
    NewUserPageComponent,
    PhotoJourneyPageComponent,
    ProfilePageComponent,
    RatingComponent,
    RateEventComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
})
export class ProfileModule {}
