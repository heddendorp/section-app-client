import { Component, Input } from '@angular/core';
import { EventListQuery } from '@tumi/legacy-app/generated/generated';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent {
  @Input() events: EventListQuery['events'] = [];

  public getId(index: number, event: EventListQuery['events'][0]): string {
    return event.id;
  }
}
