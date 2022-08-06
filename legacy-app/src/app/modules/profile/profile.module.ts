import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ClaimEventDialogComponent } from './components/claim-event-dialog/claim-event-dialog.component';
import { UpdateProfileDialogComponent } from './components/update-profile-dialog/update-profile-dialog.component';
import { UpdateUserInformationDialogComponent } from './components/update-user-information-dialog/update-user-information-dialog.component';
import { NewUserPageComponent } from './pages/new-user-page/new-user-page.component';
import { PhotoJourneyPageComponent } from './pages/photo-journey-page/photo-journey-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { SharedModule } from '@tumi/legacy-app/modules/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventListItemComponent } from './components/event-list-item/event-list-item.component';
import { ProfileCardComponent } from './components/profile-card/profile-card.component';
import { PublicProfilePageComponent } from './pages/public-profile-page/public-profile-page.component';

@NgModule({
  declarations: [
    ClaimEventDialogComponent,
    UpdateProfileDialogComponent,
    UpdateUserInformationDialogComponent,
    NewUserPageComponent,
    PhotoJourneyPageComponent,
    ProfilePageComponent,
    PublicProfilePageComponent,
    EventListComponent,
    EventListItemComponent,
    ProfileCardComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    MatDatepickerModule,
    MatRippleModule,
    ReactiveFormsModule,
  ],
})
export class ProfileModule {}
