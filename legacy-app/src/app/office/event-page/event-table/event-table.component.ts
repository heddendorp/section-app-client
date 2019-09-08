import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { TumiEvent } from '../../../shared/services/event.service';
import { MediaObserver } from '@angular/flex-layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-event-table',
  templateUrl: './event-table.component.html',
  styleUrls: ['./event-table.component.scss']
})
export class EventTableComponent implements OnInit {
  @Input() events$: Observable<TumiEvent[]>;
  @Output() edit = new EventEmitter<TumiEvent>();
  displayedColumns: Observable<string[]>;

  constructor(media: MediaObserver) {
    this.displayedColumns = media.asObservable().pipe(
      map(checks => checks.filter(check => check.matches)),
      map(matches => {
        if (matches.find(match => match.mqAlias === 'md')) {
          return ['date', 'name', 'time', 'tutors', 'students'];
        } else if (matches.find(match => match.mqAlias === 'gt-md')) {
          return ['date', 'name', 'time', 'tutors', 'students', 'status'];
        } else {
          return ['date', 'name', 'tutors'];
        }
      })
    );
  }

  ngOnInit() {}

  editEvent(event: TumiEvent) {
    this.edit.emit(event);
  }
}
