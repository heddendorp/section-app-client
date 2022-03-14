import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstagramRoutingModule } from './instagram-routing.module';
import { InstagramComponent } from './instagram.component';


@NgModule({
  declarations: [
    InstagramComponent
  ],
  imports: [
    CommonModule,
    InstagramRoutingModule
  ]
})
export class InstagramModule { }
