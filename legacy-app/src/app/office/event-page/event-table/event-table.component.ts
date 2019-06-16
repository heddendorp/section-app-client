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
export class EventTableComponent implements OnInit, OnDestroy {
  @Input() events$: Observable<TumiEvent[]>;
  @Output() edit = new EventEmitter<TumiEvent>();
  destroyed$ = new Subject();
  simpleView$: BehaviorSubject<boolean>;
  displayedColumns: Observable<string[]>;

  constructor(media: MediaObserver) {
    this.simpleView$ = new BehaviorSubject<boolean>(media.isActive(['xs', 'sm']));
    // TODO: Convert to a pipe based structure instead of a subscription with subject
    media
      .asObservable()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(checks => {
        if (checks.filter(check => check.matches).find(match => match.mqAlias === 'gt-sm')) {
          this.simpleView$.next(false);
        } else {
          this.simpleView$.next(true);
        }
      });
    this.displayedColumns = this.simpleView$.pipe(
      map(simple => (simple ? ['date', 'name', 'tutornum'] : ['date', 'name', 'time', 'tutors', 'tutornum']))
    );
  }

  ngOnInit() {}

  editEvent(event: TumiEvent) {
    this.edit.emit(event);
  }

  ngOnDestroy(): void {
    this.destroyed$.complete();
  }
}
