import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  EventListGQL,
  EventListQuery,
  Role,
} from '@tumi/legacy-app/generated/generated';
import {
  BehaviorSubject,
  combineLatest,
  firstValueFrom,
  map,
  Observable,
  startWith,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { DateTime } from 'luxon';
import { TraceClassDecorator } from '@sentry/angular';
import { EventListStateService } from '@tumi/legacy-app/services/event-list-state.service';

@Component({
  selector: 'app-event-list-page',
  templateUrl: './event-list-page.component.html',
  styleUrls: ['./event-list-page.component.scss'],
})
@TraceClassDecorator()
export class EventListPageComponent implements OnDestroy {
  public loading$ = new BehaviorSubject(true);
  public events$: Observable<EventListQuery['events']>;
  public showFullEvents = new UntypedFormControl(true);
  public filterEvents = new UntypedFormControl('');
  /** 0: all upcoming events, -1: last month, 1: next month etc. */
  public monthOffset = new UntypedFormControl(0);
  public monthOffsetLabel = 'Upcoming Events';
  public Role = Role;
  public selectedView$: Observable<string>;
  private loadEventsQueryRef;
  private destroy$ = new Subject();

  @ViewChild('searchbar')
  private searchBar!: ElementRef;
  public searchEnabled = false;

  constructor(
    private loadEventsQuery: EventListGQL,
    private title: Title,
    private eventListStateService: EventListStateService
  ) {
    this.selectedView$ = this.eventListStateService.getSelectedView();
    this.title.setTitle('TUMi - Events');
    this.loadEventsQueryRef = this.loadEventsQuery.watch();
    const events$ = this.loadEventsQueryRef.valueChanges.pipe(
      map(({ data }) => data.events),
      tap(() => this.loading$.next(false))
    );
    this.monthOffset.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.loading$.next(true))
      )
      .subscribe((value) => {
        if (value === 0) {
          this.monthOffsetLabel = 'Upcoming Events';
          return this.loadEventsQueryRef.refetch({});
        }
        const monthsOffset = value + (value < 0 ? 1 : 0);
        const startOfMonth = DateTime.local()
          .startOf('month')
          .plus({ months: monthsOffset });
        const endOfMonth = startOfMonth.endOf('month');
        this.monthOffsetLabel = startOfMonth.toFormat('LLLL yyyy');
        return this.loadEventsQueryRef.refetch({
          after: startOfMonth.toJSDate(),
          before: endOfMonth.toJSDate(),
        });
      });
    this.events$ = combineLatest([
      events$,
      this.showFullEvents.valueChanges.pipe(
        startWith(this.showFullEvents.value)
      ),
      this.filterEvents.valueChanges.pipe(startWith(this.filterEvents.value)),
    ]).pipe(
      map(([events, showFull, filterEvents]) => {
        let filteredEvents = events;
        if (!showFull) {
          filteredEvents = events.filter(
            (event) =>
              event.userIsOrganizer ||
              event.userIsRegistered ||
              event.freeParticipantSpots !== 'Event is full'
          );
        }
        if (filterEvents) {
          filteredEvents = filteredEvents.filter((event) =>
            event.title.toLowerCase().includes(filterEvents.toLowerCase())
          );
        }
        return filteredEvents;
      })
    );
    this.loadEventsQueryRef.startPolling(60 * 1000);
  }

  ngOnDestroy(): void {
    this.loadEventsQueryRef.stopPolling();
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public async toggleSelectedView() {
    const selectedView = await firstValueFrom(this.selectedView$);
    if (selectedView === 'list') {
      this.eventListStateService.setSelectedView('calendar');
    } else {
      this.eventListStateService.setSelectedView('list');
    }
  }

  initSearch(): void {
    this.searchEnabled = true;
    setTimeout(() => {
      this.searchBar.nativeElement.focus();
    });
  }

  exitSearch(): void {
    if (this.filterEvents.value.length === 0) {
      this.searchEnabled = false;
    }
  }
}
