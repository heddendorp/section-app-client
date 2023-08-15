import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  GetTutorHubEventsGQL,
  GetTutorHubEventsQuery,
} from '@tumi/legacy-app/generated/generated';
import { DateTime } from 'luxon';
import { map, Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { AsyncPipe, NgIf, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-apply-page',
  templateUrl: './apply-page.component.html',
  styleUrls: ['./apply-page.component.scss'],
  standalone: true,
  imports: [NgIf, MatCardModule, AsyncPipe, NgOptimizedImage],
})
export class ApplyPageComponent {
  private getTutorHubEventsRef;
  public events$: Observable<
    GetTutorHubEventsQuery['currentTenant']['tutorHubEvents']
  >;

  constructor(
    private title: Title,
    private getTutorHubEvents: GetTutorHubEventsGQL,
  ) {
    this.title.setTitle('Apply - TUMi');
    this.getTutorHubEventsRef = this.getTutorHubEvents.watch({
      range: {
        start: DateTime.fromObject({ year: 2022, month: 4, day: 1 }).toISO(),
        end: DateTime.fromObject({ year: 2022, month: 10, day: 1 }).toISO(),
      },
    });
    this.events$ = this.getTutorHubEventsRef.valueChanges.pipe(
      map(({ data }) => data.currentTenant.tutorHubEvents),
    );
  }
}
