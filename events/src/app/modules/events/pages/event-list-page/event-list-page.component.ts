import { Component, OnInit } from '@angular/core';
import {
  GetEventListGQL,
  GetEventListQuery,
  TumiEvent,
} from '@tumi/events/graphQL';
import { map } from 'rxjs';

@Component({
  selector: 'app-event-list-page',
  templateUrl: './event-list-page.component.html',
  styleUrls: ['./event-list-page.component.scss'],
})
export class EventListPageComponent implements OnInit {
  constructor(private eventListGQL: GetEventListGQL) {}

  events$ = this.eventListGQL
    .watch()
    .valueChanges.pipe(map((result) => result.data.events));

  ngOnInit(): void {
    this.eventListGQL.watch().valueChanges.subscribe(({ data }) => {
      console.log(data);
    });
  }
  getId(index: number, event: GetEventListQuery['events'][0]) {
    return event.id;
  }
}
