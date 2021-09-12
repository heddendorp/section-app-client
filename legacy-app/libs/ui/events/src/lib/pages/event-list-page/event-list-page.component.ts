import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { EventListGQL, EventListQuery } from '@tumi/data-access';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tumi-event-list-page',
  templateUrl: './event-list-page.component.html',
  styleUrls: ['./event-list-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventListPageComponent implements OnInit {
  public events$: Observable<EventListQuery['events']>;

  constructor(private loadEventsQuery: EventListGQL) {
    this.events$ = loadEventsQuery
      .watch()
      .valueChanges.pipe(map(({ data }) => data.events));
  }

  ngOnInit(): void {}
}
