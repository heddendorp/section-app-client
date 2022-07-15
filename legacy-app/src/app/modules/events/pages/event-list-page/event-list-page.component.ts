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
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-event-list-page',
  templateUrl: './event-list-page.component.html',
  styleUrls: ['./event-list-page.component.scss'],
})
@TraceClassDecorator()
export class EventListPageComponent implements OnDestroy {
  public loading$ = new BehaviorSubject(true);
  public events$: Observable<EventListQuery['events']>;
  public hideFullEvents = new UntypedFormControl(false);
  public filterEvents = new UntypedFormControl('');
  public selectedMonth = new UntypedFormControl(null);
  public selectedMonthLabel = 'Upcoming';
  public startOfMonth?: DateTime;
  public endOfMonth?: DateTime;
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
    private eventListStateService: EventListStateService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.selectedView$ = this.eventListStateService.getSelectedView();
    this.title.setTitle('TUMi - Events');
    this.loadEventsQueryRef = this.loadEventsQuery.watch();

    const events$ = this.loadEventsQueryRef.valueChanges.pipe(
      map(({ data }) => data.events),
      tap(() => this.loading$.next(false))
    );
    this.selectedMonth.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.loading$.next(true))
      )
      .subscribe((value) => {
        if (value === 0) {
          this.selectedMonthLabel = 'Upcoming';
          this.startOfMonth = undefined;
          this.endOfMonth = undefined;
          return this.loadEventsQueryRef.refetch({
            after: new Date(),
            before: null,
          });
        }
        this.startOfMonth = DateTime.fromObject({
          year: this.selectedMonth.value.year,
          month: this.selectedMonth.value.month,
        });
        this.endOfMonth = this.startOfMonth.endOf('month');
        this.selectedMonthLabel = this.startOfMonth.toFormat('LLLL yyyy');
        return this.loadEventsQueryRef.refetch({
          after: this.startOfMonth.startOf('week').toJSDate(),
          before: this.endOfMonth.endOf('week').toJSDate(),
        });
      });

    this.route.paramMap.subscribe((params) => {
      if (this.router.url.includes('calendar')) {
        this.eventListStateService.setSelectedView('calendar');
      }
      const year = params.get('year');
      const month = params.get('month');
      if (year && month) {
        this.selectedMonth.setValue({ year, month });
      }
    });

    this.events$ = combineLatest([
      events$,
      this.hideFullEvents.valueChanges.pipe(
        startWith(this.hideFullEvents.value)
      ),
      this.filterEvents.valueChanges.pipe(startWith(this.filterEvents.value)),
    ]).pipe(
      map(([events, hideFull, filterEvents]) => {
        let filteredEvents = events;
        if (hideFull) {
          filteredEvents = events.filter(
            (event) => event.freeParticipantSpots !== 'Event is full'
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
    if (this.searchEnabled) {
      this.searchEnabled = false;
    } else {
      this.searchEnabled = true;
      setTimeout(() => {
        this.searchBar.nativeElement.focus();
      });
    }
  }

  nextMonth(): void {
    let nextMonth;
    if (!this.selectedMonth.value) {
      nextMonth = DateTime.local().startOf('month').plus({ months: 1 });
    } else {
      nextMonth = DateTime.fromObject({
        year: this.selectedMonth.value.year,
        month: this.selectedMonth.value.month,
      }).plus({ months: 1 });
    }
    this.router.navigate([
      '/events',
      'calendar',
      nextMonth.year,
      nextMonth.month,
    ]);
  }

  previousMonth(): void {
    let prevMonth;
    if (!this.selectedMonth.value) {
      prevMonth = DateTime.local().startOf('month').minus({ months: 1 });
    } else {
      prevMonth = DateTime.fromObject({
        year: this.selectedMonth.value.year,
        month: this.selectedMonth.value.month,
      }).minus({ months: 1 });
    }
    this.router.navigate([
      '/events',
      'calendar',
      prevMonth.year,
      prevMonth.month,
    ]);
  }
}
