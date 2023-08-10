import { Component, Input } from '@angular/core';
import { EventListQuery } from '@tumi/legacy-app/generated/generated';
import { ExtendDatePipe } from '@tumi/legacy-app/modules/shared/pipes/extended-date.pipe';
import { EventsListItemComponent } from '../events-list-item/events-list-item.component';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { GridComponent } from '../../../shared/components/grid/grid.component';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss'],
  standalone: true,
  imports: [
    GridComponent,
    NgIf,
    NgFor,
    EventsListItemComponent,
    DatePipe,
    ExtendDatePipe,
  ],
})
export class EventsListComponent {
  @Input() events: EventListQuery['events'] | null = null;

  public getId(index: number, event: EventListQuery['events'][0]): string {
    return event.id;
  }
}
