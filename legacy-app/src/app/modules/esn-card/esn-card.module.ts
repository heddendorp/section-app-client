import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EsnCardRoutingModule } from './esn-card-routing.module';
import { EsnCardComponent } from './esn-card.component';
import { SharedModule } from '@tumi/modules/shared';

@NgModule({
  declarations: [EsnCardComponent],
  imports: [CommonModule, EsnCardRoutingModule, SharedModule],
})
export class EsnCardModule {}
