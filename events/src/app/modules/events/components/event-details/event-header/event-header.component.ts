import { Component, Input } from '@angular/core';
import { GetEventDetailsQuery } from '@tumi/events/graphQL';

@Component({
  selector: 'app-event-header',
  templateUrl: './event-header.component.html',
  styleUrls: ['./event-header.component.scss'],
})
export class EventHeaderComponent {
  @Input() public event: GetEventDetailsQuery['event'] | null = null;

  constructor() {}
}
