import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { EventListGQL, EventListQuery } from '@tumi/data-access';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'tumi-event-list-page',
  templateUrl: './event-list-page.component.html',
  styleUrls: ['./event-list-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventListPageComponent implements OnDestroy {
  public events$: Observable<EventListQuery['events']>;
  public showFullEvents = new FormControl(false);
  private loadEventsQueryRef;

  constructor(private loadEventsQuery: EventListGQL, private title: Title) {
    this.title.setTitle('TUMi - events');
    this.loadEventsQueryRef = this.loadEventsQuery.watch();
    const events$ = this.loadEventsQueryRef.valueChanges.pipe(
      map(({ data }) => data.events)
    );
    this.events$ = combineLatest([
      events$,
      this.showFullEvents.valueChanges.pipe(startWith(false)),
    ]).pipe(
      map(([events, showFull]) => {
        if (showFull) {
          return events;
        }
        return events.filter(
          (event) => event.participantLimit > event.participantsRegistered
        );
      })
    );
    this.loadEventsQueryRef.startPolling(10000);
  }

  ngOnDestroy() {
    this.loadEventsQueryRef.stopPolling();
  }
}
