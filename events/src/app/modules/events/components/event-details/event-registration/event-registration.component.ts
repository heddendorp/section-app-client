import { Component, Input, OnInit } from '@angular/core';
import { GetEventDetailsQuery } from '@tumi/events/graphQL';

@Component({
  selector: 'app-event-registration',
  templateUrl: './event-registration.component.html',
  styleUrls: ['./event-registration.component.scss'],
})
export class EventRegistrationComponent {
  @Input() public event: GetEventDetailsQuery['event'] | null = null;
}
