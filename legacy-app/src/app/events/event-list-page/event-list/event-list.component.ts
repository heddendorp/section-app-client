import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TumiEvent } from '../../../shared/services/event.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  @Input() events: TumiEvent[];
  @Output() details = new EventEmitter<TumiEvent>();

  constructor() {}

  ngOnInit() {
    setTimeout(() => this.details.emit(this.events[1]), 1000);
  }
}
