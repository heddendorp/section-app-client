import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
export class EventListPageComponent implements OnInit {
  public events$: Observable<EventListQuery['events']>;

  constructor(private loadEventsQuery: EventListGQL, private title: Title) {
    this.title.setTitle('TUMi - events');
    this.events$ = loadEventsQuery
      .watch()
      .valueChanges.pipe(map(({ data }) => data.events));
  }

  ngOnInit(): void {}
}
