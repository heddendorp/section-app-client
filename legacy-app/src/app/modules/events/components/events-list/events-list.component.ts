import { Component, Input } from '@angular/core';
import { EventListQuery } from '@tumi/legacy-app/generated/generated';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss'],
})
export class EventsListComponent {
  @Input() events: EventListQuery['events'] = [];

  public getId(index: number, event: EventListQuery['events'][0]): string {
    return event.id;
  }
}
