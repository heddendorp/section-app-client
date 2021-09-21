import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventListPageComponent } from './pages/event-list-page/event-list-page.component';
import { EventDetailsPageComponent } from './pages/event-details-page/event-details-page.component';
import { EventEditPageComponent } from './pages/event-edit-page/event-edit-page.component';
import { EventRunPageComponent } from './pages/event-run-page/event-run-page.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UtilPipesModule } from '@tumi/util/pipes';
import { MatButtonModule } from '@angular/material/button';
import { MarkdownModule } from 'ngx-markdown';
import { EventHeaderComponent } from './components/event-header/event-header.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventListItemComponent } from './components/event-list-item/event-list-item.component';
import { UtilComponentsModule } from '@tumi/util-components';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UtilMaterialModule } from '@tumi/util/material';
import { AuthGuard } from '@auth0/auth0-angular';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UiAuthModule } from '@tumi/ui-auth';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SelectOrganizerDialogComponent } from './components/select-organizer-dialog/select-organizer-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ExternalEventRegistrationComponent } from './components/registration/external-event-registration/external-event-registration.component';
import { StripeRegistrationComponent } from './components/registration/stripe-registration/stripe-registration.component';
import { OnlineEventRegistrationComponent } from './components/registration/online-event-registration/online-event-registration.component';
import { EventManagePageComponent } from './pages/event-manage-page/event-manage-page.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: EventListPageComponent },
      { path: ':eventId', component: EventDetailsPageComponent },
      {
        path: ':eventId/edit',
        canActivate: [AuthGuard],
        component: EventEditPageComponent,
      },
      {
        path: ':eventId/run',
        canActivate: [AuthGuard],
        component: EventRunPageComponent,
      },
      {
        path: ':eventId/manage',
        canActivate: [AuthGuard],
        component: EventManagePageComponent,
      },
    ]),
    UtilPipesModule,
    UtilComponentsModule,
    UiAuthModule,
    FlexLayoutModule,
    MatButtonModule,
    MatSnackBarModule,
    MarkdownModule.forChild(),
    UtilMaterialModule,
    MatListModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatAutocompleteModule,
  ],
  declarations: [
    EventListPageComponent,
    EventDetailsPageComponent,
    EventEditPageComponent,
    EventRunPageComponent,
    EventHeaderComponent,
    EventListComponent,
    EventListItemComponent,
    SelectOrganizerDialogComponent,
    ExternalEventRegistrationComponent,
    StripeRegistrationComponent,
    OnlineEventRegistrationComponent,
    EventManagePageComponent,
  ],
})
export class UiEventsModule {}
