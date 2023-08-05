import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  GetTutorHubEventsGQL,
  GetTutorHubEventsQuery,
  GetTutorHubInfoGQL,
  GetTutorHubInfoQuery,
  GetUsersGQL,
  GetUsersQuery,
  MembershipStatus,
} from '@tumi/legacy-app/generated/generated';
import { DateTime } from 'luxon';
import {
  BehaviorSubject,
  debounceTime,
  map,
  Observable,
  shareReplay,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { IconURLPipe } from '@tumi/legacy-app/modules/shared/pipes/icon-url.pipe';
import { GridComponent } from '../shared/components/grid/grid.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EventListItemComponent } from '../shared/components/event-list-item/event-list-item.component';
import { MatListModule } from '@angular/material/list';
import { UserChipComponent } from '../shared/components/user-chip/user-chip.component';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { SemesterNavigatorComponent } from './semester-navigator/semester-navigator.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { ResetScrollDirective } from '../shared/directives/reset-scroll.directive';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveToolbarComponent } from '../shared/components/reactive-toolbar/reactive-toolbar.component';

@Component({
    selector: 'app-tutor-hub',
    templateUrl: './tutor-hub.component.html',
    styleUrls: ['./tutor-hub.component.scss'],
    standalone: true,
    imports: [
        ReactiveToolbarComponent,
        MatToolbarModule,
        ResetScrollDirective,
        NgIf,
        MatProgressBarModule,
        SemesterNavigatorComponent,
        MatDividerModule,
        MatIconModule,
        MatRippleModule,
        NgFor,
        UserChipComponent,
        MatListModule,
        EventListItemComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        GridComponent,
        AsyncPipe,
        IconURLPipe,
    ],
})
export class TutorHubComponent implements OnInit, OnDestroy {
  public tutorHubData$: Observable<
    GetTutorHubInfoQuery['currentTenant']['tutorHub']
  >;
  public resourceLinks$: Observable<
    GetTutorHubInfoQuery['currentTenant']['settings']['sectionHubLinks']
  >;
  public events$: Observable<
    GetTutorHubEventsQuery['currentTenant']['tutorHubEvents']
  >;
  public eventsLoading$ = new BehaviorSubject(true);
  public searchedTutors$: Observable<GetUsersQuery['users']>;
  public filterForm: UntypedFormGroup;
  public currentSearch = '';
  public searchLoading$ = new BehaviorSubject(false);
  public range: { start: DateTime; end: DateTime } = this.calculateStartEnd(
    DateTime.now()
  );
  public leaderboardToggle = false;
  public leaderboardExpanded = false;
  private getTutorHubEventsRef;
  private loadUsersReference;
  private destroyed$ = new Subject();

  constructor(
    private getTutorHubInfo: GetTutorHubInfoGQL,
    private getTutorHubEvents: GetTutorHubEventsGQL,
    private loadUsers: GetUsersGQL,
    private fb: UntypedFormBuilder
  ) {
    const getTutorHubInfoRef = this.getTutorHubInfo.watch();
    this.tutorHubData$ = getTutorHubInfoRef.valueChanges.pipe(
      map(({ data }) => data.currentTenant.tutorHub)
    );
    this.resourceLinks$ = getTutorHubInfoRef.valueChanges.pipe(
      map(({ data }) => data.currentTenant.settings.sectionHubLinks)
    );

    this.getTutorHubEventsRef = this.getTutorHubEvents.watch();
    this.events$ = this.getTutorHubEventsRef.valueChanges.pipe(
      map(({ data }) => data.currentTenant.tutorHubEvents),
      tap(() => this.eventsLoading$.next(false))
    );

    this.filterForm = this.fb.group({
      search: [''],
    });
    this.loadUsersReference = this.loadUsers.watch({
      pageLength: 20,
      pageIndex: 0,
      statusList: [
        MembershipStatus.Full,
        MembershipStatus.Trial,
        MembershipStatus.Alumni,
        MembershipStatus.Sponsor,
      ],
      emptyOnEmptySearch: true,
    });
    this.searchedTutors$ = this.loadUsersReference.valueChanges.pipe(
      map(({ data }) => data.users),
      tap(() => {
        this.searchLoading$.next(false);
      }),
      shareReplay(1)
    );
  }

  ngOnInit(): void {
    this.filterForm.valueChanges
      .pipe(
        takeUntil(this.destroyed$),
        debounceTime(500),
        tap(() => {
          this.searchLoading$.next(true);
        })
      )
      .subscribe((value) => this.loadUsersReference.refetch(value));
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  updateRange(range: { start: DateTime; end: DateTime }) {
    this.eventsLoading$.next(true);
    this.getTutorHubEventsRef.refetch({
      range,
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

  getLeaderboard(events: any) {
    const leaderboard = this.leaderboardToggle
      ? events.creatorLeaderboard
      : events.organizerLeaderboard;
    return leaderboard.slice(0, this.leaderboardExpanded ? 30 : 10);
  }
}
