import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, map, Observable, Subject, takeUntil } from 'rxjs';
import {
  TenantLoadEventsGQL,
  TenantLoadEventsQuery,
} from '@tumi/legacy-app/generated/generated';
import { ExtendDatePipe } from '@tumi/legacy-app/modules/shared/pipes/extended-date.pipe';
import { RouterLink } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { EventChipComponent } from '../../../../shared/components/event-chip/event-chip.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf, AsyncPipe, DatePipe } from '@angular/common';
import { ResetScrollDirective } from '../../../../shared/directives/reset-scroll.directive';
import { BackButtonComponent } from '../../../../shared/components/back-button/back-button.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveToolbarComponent } from '../../../../shared/components/reactive-toolbar/reactive-toolbar.component';

@Component({
    selector: 'app-tenant-events-page',
    templateUrl: './tenant-events-page.component.html',
    styleUrls: ['./tenant-events-page.component.scss'],
    standalone: true,
    imports: [
        ReactiveToolbarComponent,
        MatToolbarModule,
        BackButtonComponent,
        ResetScrollDirective,
        NgIf,
        MatProgressBarModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatInputModule,
        MatIconModule,
        MatTableModule,
        EventChipComponent,
        MatRippleModule,
        RouterLink,
        AsyncPipe,
        DatePipe,
        ExtendDatePipe,
    ],
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

  constructor(private tenantLoadEventsGQL: TenantLoadEventsGQL) {
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
