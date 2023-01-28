import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import {
  EventListGQL,
  EventListQuery,
  GetCurrentUserInfoGQL,
  GetTenantInfoGQL,
  GetTenantInfoQuery,
  Role,
} from '@tumi/legacy-app/generated/generated';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  firstValueFrom,
  map,
  Observable,
  share,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { DateTime } from 'luxon';
import { TraceClassDecorator } from '@sentry/angular';
import { EventListStateService } from '@tumi/legacy-app/services/event-list-state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { PublicRegistrationCodesPageComponent } from '../public-registration-codes-page/public-registration-codes-page.component';
import { MatDialog } from '@angular/material/dialog';
import { PermissionsService } from '@tumi/legacy-app/modules/shared/services/permissions.service';

@Component({
  selector: 'app-event-list-page',
  templateUrl: './event-list-page.component.html',
  styleUrls: ['./event-list-page.component.scss'],
  animations: [
    trigger('grow', [
      transition(':enter', [
        style({
          height: '0px',
          paddingTop: '0',
          paddingBottom: '0',
          opacity: '0',
        }),
        animate('0.5s ease-in'),
      ]),
    ]),
  ],
})
@TraceClassDecorator()
export class EventListPageComponent implements OnDestroy {
  public loading$ = new BehaviorSubject(true);
  public events$: Observable<EventListQuery['events']>;
  public hideFullEvents = new UntypedFormControl(false);
  public hideFullTutorEvents = new UntypedFormControl(false);
  public filterEvents = new UntypedFormControl('');
  public selectedMonth = new UntypedFormControl(null);
  public selectedMonthLabel = 'Upcoming Events';
  public startOfMonth?: DateTime;
  public endOfMonth?: DateTime;
  public Role = Role;
  public selectedView$: Observable<string>;
  public serverTimeZone = DateTime.local({ locale: 'en-GB' }).offsetNameShort;
  public timeOffset =
    Math.abs(-new Date().getTimezoneOffset() - DateTime.local().offset) / 60;
  public outstandingRating$: Observable<boolean>;
  public tenant$: Observable<GetTenantInfoQuery['currentTenant']>;
  public searchEnabled = false;
  public isMember$ = this.permissionsService.isMember();
  private loadEventsQueryRef;
  private destroy$ = new Subject();
  @ViewChild('searchbar')
  private searchBar!: ElementRef;

  constructor(
    private loadEventsQuery: EventListGQL,
    private eventListStateService: EventListStateService,
    private route: ActivatedRoute,
    private router: Router,
    private getTenantInfo: GetTenantInfoGQL,
    private getCurrentUserInfoGQL: GetCurrentUserInfoGQL,
    private dialog: MatDialog,
    private permissionsService: PermissionsService
  ) {
    this.selectedView$ = this.eventListStateService.getSelectedView();
    this.loadEventsQueryRef = this.loadEventsQuery.watch();

    const events$ = this.loadEventsQueryRef.valueChanges.pipe(
      map(({ data }) => data.events)
    );
    this.selectedMonth.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        map((value) => {
          this.loading$.next(true);
          if (value === 0) {
            this.selectedMonthLabel = 'Upcoming Events';
            this.startOfMonth = undefined;
            this.endOfMonth = undefined;
            return {
              after: new Date(),
              before: null,
            };
          }
          this.startOfMonth = DateTime.fromObject({
            year: this.selectedMonth.value.year,
            month: this.selectedMonth.value.month,
          });
          this.endOfMonth = this.startOfMonth.endOf('month');
          this.selectedMonthLabel = this.startOfMonth.toFormat('LLLL yyyy');
          return {
            after: this.startOfMonth.startOf('week').toJSDate(),
            before: this.endOfMonth.endOf('week').toJSDate(),
          };
        }),
        debounceTime(500)
      )
      .subscribe((parameters: any) => {
        return this.loadEventsQueryRef.refetch(parameters).then(() => {
          this.loading$.next(false);
        });
      });

    this.route.paramMap.subscribe((params) => {
      if (this.router.url.includes('calendar')) {
        this.eventListStateService.setSelectedView('calendar');
      } else if (this.router.url.includes('list')) {
        this.eventListStateService.setSelectedView('list');
      }
      const year = params.get('year');
      const month = params.get('month');
      if (year && month) {
        this.selectedMonth.setValue({ year, month });
      }
    });

    this.events$ = combineLatest([
      events$,
      this.hideFullEvents.valueChanges.pipe(
        startWith(this.hideFullEvents.value)
      ),
      this.hideFullTutorEvents.valueChanges.pipe(
        startWith(this.hideFullTutorEvents.value)
      ),
      this.filterEvents.valueChanges.pipe(startWith(this.filterEvents.value)),
    ]).pipe(
      map(([events, hideFull, hideFullTutors, filterEvents]) => {
        this.loading$.next(false);
        let filteredEvents = events;
        if (hideFull) {
          filteredEvents = events.filter(
            (event) =>
              event.participantRegistrationCount < event.participantLimit
          );
        }
        if (hideFullTutors) {
          filteredEvents = events.filter(
            (event) => event.organizersRegistered < event.organizerLimit
          );
        }
        if (filterEvents) {
          filteredEvents = filteredEvents.filter((event) =>
            event.title.toLowerCase().includes(filterEvents.toLowerCase())
          );
        }
        return filteredEvents;
      })
    );

    this.loadEventsQueryRef.startPolling(60 * 1000);

    const tenantChanges = this.getTenantInfo.watch().valueChanges.pipe(share());
    this.tenant$ = tenantChanges.pipe(map(({ data }) => data.currentTenant));
    this.outstandingRating$ = this.getCurrentUserInfoGQL
      .watch()
      .valueChanges.pipe(
        map(({ data }) => data.currentUser?.outstandingRating ?? false)
      );

    if (router.url.includes('codes')) {
      this.showCodesDialog();
    }
  }

  ngOnDestroy(): void {
    this.loadEventsQueryRef.stopPolling();
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public async toggleSelectedView() {
    const filterValue = this.filterEvents.value;
    const selectedView = await firstValueFrom(this.selectedView$);
    let newSelectedView;
    if (selectedView === 'list') {
      newSelectedView = 'calendar';
    } else {
      newSelectedView = 'list';
    }
    this.eventListStateService.setSelectedView(newSelectedView);
    void this.router.navigateByUrl(
      this.router.url.replace(selectedView, newSelectedView)
    );
    setTimeout(() => {
      this.filterEvents.setValue(filterValue);
    });
  }

  initSearch(): void {
    if (this.searchEnabled) {
      this.searchEnabled = false;
      this.filterEvents.setValue('');
    } else {
      this.searchEnabled = true;
      setTimeout(() => {
        this.searchBar.nativeElement.focus();
      });
    }
  }

  async nextMonth() {
    let nextMonth;
    if (!this.selectedMonth.value) {
      nextMonth = DateTime.local().startOf('month').plus({ months: 1 });
    } else {
      nextMonth = DateTime.fromObject({
        year: this.selectedMonth.value.year,
        month: this.selectedMonth.value.month,
      }).plus({ months: 1 });
    }
    this.router.navigate([
      '/events',
      await firstValueFrom(this.selectedView$),
      nextMonth.year,
      nextMonth.month,
    ]);
  }

  async previousMonth() {
    let prevMonth;
    if (!this.selectedMonth.value) {
      prevMonth = DateTime.local().startOf('month');
    } else {
      prevMonth = DateTime.fromObject({
        year: this.selectedMonth.value.year,
        month: this.selectedMonth.value.month,
      }).minus({ months: 1 });
    }
    this.router.navigate([
      '/events',
      await firstValueFrom(this.selectedView$),
      prevMonth.year,
      prevMonth.month,
    ]);
  }

  showCodesDialog() {
    this.dialog.open(PublicRegistrationCodesPageComponent, {
      width: '600px',
      maxWidth: '100vw',
      autoFocus: false,
      panelClass: 'modern',
    });
  }
}
