import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  catchError,
  debounceTime,
  map,
  Observable,
  of,
  Subject,
  takeUntil,
} from 'rxjs';
import {
  TenantLoadEventsGQL,
  TenantLoadEventsQuery,
} from '@tumi/legacy-app/generated/generated';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-tenant-events-page',
  templateUrl: './tenant-events-page.component.html',
  styleUrls: ['./tenant-events-page.component.scss'],
})
export class TenantEventsPageComponent implements OnInit, OnDestroy {
  public displayedColumns = [
    'name',
    'date',
    // 'role',
    // 'action',
  ];
  public events$: Observable<TenantLoadEventsQuery['events']>;
  public filterForm = new FormGroup({
    range: new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
    }),
    search: new FormControl(''),
  });
  private loadEventsRef;
  private destroyed$ = new Subject();

  constructor(private tenantLoadEventsGQL: TenantLoadEventsGQL, private title: Title) {
    this.title.setTitle('Event List - TUMi');
    this.loadEventsRef = this.tenantLoadEventsGQL.watch();
    this.events$ = this.loadEventsRef.valueChanges.pipe(
      map((res) => res.data.events)
    );
  }

  ngOnInit() {
    this.filterForm.valueChanges
      .pipe(takeUntil(this.destroyed$), debounceTime(500))
      .subscribe((value) => {
        this.loadEventsRef.refetch({
          after: value.range?.start,
          before: value.range?.end,
          search: value.search ?? undefined,
        });
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
