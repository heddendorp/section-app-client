import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssociationRoutingModule } from './association-routing.module';
import { AssociationComponent } from './association.component';

@NgModule({
  declarations: [AssociationComponent],
  imports: [CommonModule, AssociationRoutingModule],
})
export class AssociationModule {}
