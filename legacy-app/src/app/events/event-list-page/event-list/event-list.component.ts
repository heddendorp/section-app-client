import { Component, Input, OnInit } from '@angular/core';
import { TumiEvent } from '../../../shared/services/event.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  @Input() events: TumiEvent[];
  constructor() {}

  ngOnInit() {}
}
