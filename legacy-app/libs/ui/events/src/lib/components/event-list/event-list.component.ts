import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { EventListQuery } from '@tumi/data-access';

@Component({
  selector: 'tumi-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventListComponent implements OnInit {
  @Input() events: EventListQuery['events'] = [];
  constructor() {}

  ngOnInit(): void {}

  public getId(index: number, event: EventListQuery['events'][0]): string {
    return event.id;
  }
}
