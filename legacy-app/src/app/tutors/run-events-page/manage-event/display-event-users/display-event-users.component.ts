import { Component, Input, OnInit } from '@angular/core';
import { TumiEvent } from '../../../../shared/services/event.service';

@Component({
  selector: 'app-display-event-users',
  templateUrl: './display-event-users.component.html',
  styleUrls: ['./display-event-users.component.scss']
})
export class DisplayEventUsersComponent implements OnInit {
  @Input() event: TumiEvent;

  constructor() {}

  ngOnInit() {}
}
