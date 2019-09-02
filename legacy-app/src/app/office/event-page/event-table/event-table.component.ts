import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { TumiEvent } from '../../../shared/services/event.service';
import { MediaObserver } from '@angular/flex-layout';
import { map, takeUntil } from 'rxjs/operators';

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
      map(checks => !checks.filter(check => check.matches).find(match => match.mqAlias === 'gt-sm')),
      map(simple => (simple ? ['date', 'name', 'tutornum'] : ['date', 'name', 'time', 'tutornum']))
    );
  }

  ngOnInit() {}

  editEvent(event: TumiEvent) {
    this.edit.emit(event);
  }
}
