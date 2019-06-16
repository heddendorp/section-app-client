import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { TumiEvent } from '../../../shared/services/event.service';

@Component({
  selector: 'app-event-table',
  templateUrl: './event-table.component.html',
  styleUrls: ['./event-table.component.scss']
})
export class EventTableComponent implements OnInit {
  @Input() events$: Observable<TumiEvent[]>;
  @Output() edit = new EventEmitter<TumiEvent>();

  constructor() {}

  displayedColumns: string[] = ['date', 'name', 'time', 'tutors', 'tutornum'];

  ngOnInit() {}

  editEvent(event: TumiEvent) {
    this.edit.emit(event);
  }
}
