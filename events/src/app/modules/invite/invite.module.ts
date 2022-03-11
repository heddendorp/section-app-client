import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InviteRoutingModule } from './invite-routing.module';
import { InviteComponent } from './invite.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [InviteComponent],
  imports: [CommonModule, InviteRoutingModule, MatButtonModule],
})
export class InviteModule {}
