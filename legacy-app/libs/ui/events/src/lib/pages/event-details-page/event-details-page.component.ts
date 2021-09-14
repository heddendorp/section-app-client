import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadEventGQL, LoadEventQuery } from '@tumi/data-access';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'tumi-event-details-page',
  templateUrl: './event-details-page.component.html',
  styleUrls: ['./event-details-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailsPageComponent implements OnInit {
  public event$: Observable<LoadEventQuery['event']>;
  constructor(private route: ActivatedRoute, private loadEvent: LoadEventGQL) {
    this.event$ = this.route.paramMap.pipe(
      switchMap(
        (params) =>
          this.loadEvent.watch({ id: params.get('eventId') ?? '' }).valueChanges
      ),
      map(({ data }) => data.event)
    );
  }

  ngOnInit(): void {}
}
