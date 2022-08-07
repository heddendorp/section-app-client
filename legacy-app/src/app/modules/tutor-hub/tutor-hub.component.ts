import { Component } from '@angular/core';
import { GetTutorHubInfoGQL, GetTutorHubInfoQuery, GetTutorHubEventsQuery, GetTutorHubEventsGQL } from '@tumi/legacy-app/generated/generated';
import { DateTime } from 'luxon';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-tutor-hub',
  templateUrl: './tutor-hub.component.html',
  styleUrls: ['./tutor-hub.component.scss'],
})
export class TutorHubComponent {
  public tutorHubData$: Observable<GetTutorHubInfoQuery['currentTenant']['tutorHub']>;
  public events$: Observable<GetTutorHubEventsQuery['currentTenant']['tutorHubEvents']>;
  public eventsLoading$ = new BehaviorSubject(true);

  private getTutorHubEventsRef;

  public range: { start: DateTime, end: DateTime } = this.calculateStartEnd(DateTime.now());

  constructor(
    private getTutorHubInfo: GetTutorHubInfoGQL,
    private getTutorHubEvents: GetTutorHubEventsGQL
    ) {
    
    const getTutorHubInfoRef = this.getTutorHubInfo.watch();
    this.tutorHubData$ = getTutorHubInfoRef.valueChanges.pipe(map(({ data }) => data.currentTenant.tutorHub));

    this.getTutorHubEventsRef = this.getTutorHubEvents.watch();
    this.events$ = this.getTutorHubEventsRef.valueChanges.pipe(
      map(({ data }) => data.currentTenant.tutorHubEvents),
      tap(() => this.eventsLoading$.next(false))
    );
  }

  updateRange(range: { start: DateTime, end: DateTime }) {  
    this.eventsLoading$.next(true);
    this.getTutorHubEventsRef.refetch({
      range
    });
  }

  calculateStartEnd(date: DateTime) {
    let start;
    if (date.month <= 3) {
      start = DateTime.fromObject({ year: date.year - 1, month: 10, day: 1 });
    } else if (date.month >= 4 && date.month < 10) {
      start = DateTime.fromObject({ year: date.year, month: 4, day: 1 });
    } else {
      start = DateTime.fromObject({ year: date.year, month: 10, day: 1 });
    }
    const end = start.plus({ months: 6 });

    return {
      start,
      end,
    };
  }
}
