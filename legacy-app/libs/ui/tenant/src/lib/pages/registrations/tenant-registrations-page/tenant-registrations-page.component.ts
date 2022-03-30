import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import {
  GetRegistrationCountGQL,
  GetRegistrationCountQuery,
  GetRegistrationsGQL,
  GetRegistrationsQuery,
} from '@tumi/data-access';
import { Title } from '@angular/platform-browser';
import { map } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'tumi-tenant-registrations-page',
  templateUrl: './tenant-registrations-page.component.html',
  styleUrls: ['./tenant-registrations-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantRegistrationsPageComponent implements OnDestroy {
  public registrations$: Observable<GetRegistrationsQuery['registrations']>;
  public registrationCount$: Observable<
    GetRegistrationCountQuery['registrationCount']
  >;
  public displayedColumns = [
    'event',
    'user',
    'created',
    'type',
    'amount',
    'status',
  ];
  private registrationsQueryRef;
  constructor(
    private title: Title,
    private getRegistrationsGQL: GetRegistrationsGQL,
    private getRegistrationCountGQL: GetRegistrationCountGQL
  ) {
    this.title.setTitle('TUMi - manage registrations');
    this.registrationsQueryRef = this.getRegistrationsGQL.watch({
      pageLength: 20,
      pageIndex: 0,
    });
    this.registrationCount$ = this.getRegistrationCountGQL
      .watch()
      .valueChanges.pipe(map(({ data }) => data.registrationCount));
    this.registrations$ = this.registrationsQueryRef.valueChanges.pipe(
      map(({ data }) => data.registrations)
    );
  }

  ngOnDestroy(): void {
    this.registrationsQueryRef.stopPolling();
  }

  updatePage($event: PageEvent) {
    this.registrationsQueryRef.refetch({
      pageIndex: $event.pageIndex,
      pageLength: $event.pageSize,
    });
  }
}
