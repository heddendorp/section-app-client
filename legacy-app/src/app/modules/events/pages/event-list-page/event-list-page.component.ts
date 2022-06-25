import { Component, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  EventListGQL,
  EventListQuery,
  Role,
} from '@tumi/legacy-app/generated/generated';
import {
  combineLatest,
  firstValueFrom,
  map,
  Observable,
  startWith,
  Subject,
  takeUntil,
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
  public events$: Observable<EventListQuery['events']>;
  public showFullEvents = new UntypedFormControl(true);
  public filterEvents = new UntypedFormControl('');
  public eventsAfter = new UntypedFormControl(
    DateTime.local().toISO({ includeOffset: false })
  );
  public Role = Role;
  public selectedView: Observable<string>;
  private loadEventsQueryRef;
  private destroy$ = new Subject();

  constructor(
    private loadEventsQuery: EventListGQL,
    private title: Title,
    private eventListStateService: EventListStateService
  ) {
    this.selectedView = this.eventListStateService.getSelectedView();
    this.title.setTitle('TUMi - events');
    this.loadEventsQueryRef = this.loadEventsQuery.watch();
    const events$ = this.loadEventsQueryRef.valueChanges.pipe(
      map(({ data }) => data.events)
    );
    this.eventsAfter.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) =>
        this.loadEventsQueryRef.refetch({
          after: value.toJSDate(),
        })
      );
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
              event.userRegistered ||
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
    const selectedView = await firstValueFrom(this.selectedView);
    if (selectedView === 'list') {
      this.eventListStateService.setSelectedView('calendar');
    } else {
      this.eventListStateService.setSelectedView('list');
    }
  }
}
