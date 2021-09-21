import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { EventListGQL, EventListQuery } from '@tumi/data-access';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'tumi-event-list-page',
  templateUrl: './event-list-page.component.html',
  styleUrls: ['./event-list-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventListPageComponent implements OnDestroy {
  public events$: Observable<EventListQuery['events']>;
  private loadEventsQueryRef;

  constructor(private loadEventsQuery: EventListGQL, private title: Title) {
    this.title.setTitle('TUMi - events');
    this.loadEventsQueryRef = this.loadEventsQuery.watch();
    this.events$ = this.loadEventsQueryRef.valueChanges.pipe(
      map(({ data }) => data.events)
    );
    this.loadEventsQueryRef.startPolling(10000);
  }

  ngOnDestroy() {
    this.loadEventsQueryRef.stopPolling();
  }
}
