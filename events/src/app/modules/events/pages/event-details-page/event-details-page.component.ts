import { Component, OnDestroy } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { GetEventDetailsGQL, GetEventDetailsQuery } from '@tumi/events/graphQL';

@Component({
  selector: 'app-event-details-page',
  templateUrl: './event-details-page.component.html',
  styleUrls: ['./event-details-page.component.scss'],
})
export class EventDetailsPageComponent {
  public event: Observable<GetEventDetailsQuery['event']>;

  constructor(
    private eventDetailsGQL: GetEventDetailsGQL,
    private route: ActivatedRoute
  ) {
    this.event = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id') ?? '';
        return this.eventDetailsGQL
          .watch({ id })
          .valueChanges.pipe(map((result) => result.data.event));
      })
    );
  }
}
