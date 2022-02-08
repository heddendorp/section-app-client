import { Component, OnDestroy } from '@angular/core';
import { map, Observable, switchMap, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { GetEventDetailsGQL, GetEventDetailsQuery } from '@tumi/events/graphQL';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-event-details-page',
  templateUrl: './event-details-page.component.html',
  styleUrls: ['./event-details-page.component.scss'],
})
export class EventDetailsPageComponent {
  public event: Observable<GetEventDetailsQuery['event']>;

  constructor(
    private eventDetailsGQL: GetEventDetailsGQL,
    private route: ActivatedRoute,
    private metaService: Meta,
    private titleService: Title
  ) {
    this.event = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id') ?? '';
        return this.eventDetailsGQL
          .watch({ id })
          .valueChanges.pipe(map((result) => result.data.event));
      }),
      tap((event) => {
        this.titleService.setTitle(`${event.title} - TUMi Events`);
        this.metaService.updateTag({
          name: 'og:title',
          content: `${event.title} - TUMi Events`,
        });
        this.metaService.updateTag({
          name: 'og:url',
          content: `https://tumi.esn.world/events/${event.id}`,
        });
        this.metaService.updateTag({
          name: 'image',
          content: environment.server + '/social/event/' + event.id,
        });
        this.metaService.updateTag({
          name: 'og:image',
          content: environment.server + '/social/event/' + event.id,
        });
      })
    );
  }
}
