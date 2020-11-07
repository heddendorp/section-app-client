import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { SharedModule } from '../shared';
import { ProfileDialogComponent } from './components/profile-dialog/profile-dialog.component';

@NgModule({
  declarations: [ProfileComponent, ProfileDialogComponent],
  imports: [CommonModule, ProfileRoutingModule, SharedModule],
})
export class ProfileModule {}
