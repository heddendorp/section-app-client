import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: 'events' }];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class EventsModule {}
