import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EventListQuery } from '@tumi/data-access';

@Component({
  selector: 'tumi-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventListComponent {
  @Input() events: EventListQuery['events'] = [];

  public getId(index: number, event: EventListQuery['events'][0]): string {
    return event.id;
  }
}
