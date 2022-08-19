import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  GetRegistrationCountGQL,
  GetRegistrationCountQuery,
  GetRegistrationsGQL,
  GetRegistrationsQuery,
} from '@tumi/legacy-app/generated/generated';
import { PageEvent } from '@angular/material/paginator';
import { Title } from '@angular/platform-browser';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-tenant-registrations-page',
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
    this.title.setTitle('Registrations - TUMi');
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
