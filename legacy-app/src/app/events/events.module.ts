import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { EventDetailsDisplayComponent } from './event-details-page/event-details-display/event-details-display.component';
import { EventDetailsPageComponent } from './event-details-page/event-details-page.component';
import { EventListPageComponent } from './event-list-page/event-list-page.component';
import { EventListComponent } from './event-list-page/event-list/event-list.component';
import { RegisteredListComponent } from './registered-list/registered-list.component';
import { LoadEventResolver } from './resolvers/load-event.resolver';

const routes: Routes = [
  { path: 'list', component: EventListPageComponent },
  { path: 'show/:eventId', component: EventDetailsPageComponent, resolve: { event: LoadEventResolver } },
  { path: 'my', component: RegisteredListComponent, canActivate: [AngularFireAuthGuard] },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    EventListPageComponent,
    EventListComponent,
    RegisteredListComponent,
    EventDetailsPageComponent,
    UserProfileComponent,
    EventDetailsDisplayComponent
  ],
  providers: [LoadEventResolver],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule]
})
export class EventsModule {}
