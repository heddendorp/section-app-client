import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { EventListPageComponent } from './pages/event-list-page/event-list-page.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventListItemComponent } from './components/event-list-item/event-list-item.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { SharedModule } from '@tumi/legacy-app/modules/shared/shared.module';
import { MarkdownModule } from 'ngx-markdown';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EventCalendarComponent } from './components/event-calendar/event-calendar.component';
import { EventCalendarDayDialogComponent } from './components/event-calendar/event-calendar-day-dialog/event-calendar-day-dialog';
import { PublicRegistrationCodesPageComponent } from './pages/public-registration-codes-page/public-registration-codes-page.component';

@NgModule({
  declarations: [
    EventListPageComponent,
    EventListComponent,
    EventListItemComponent,
    EventCalendarComponent,
    EventCalendarDayDialogComponent,
    PublicRegistrationCodesPageComponent
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    SharedModule,
    MatDatepickerModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MarkdownModule.forChild(),
    MatExpansionModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatRippleModule,
    MatSlideToggleModule,
  ],
})
export class EventsModule {}
