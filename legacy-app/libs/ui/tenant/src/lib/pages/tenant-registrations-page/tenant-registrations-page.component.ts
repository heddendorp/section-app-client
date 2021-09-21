import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { GetRegistrationsGQL, GetRegistrationsQuery } from '@tumi/data-access';
import { Title } from '@angular/platform-browser';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tumi-tenant-registrations-page',
  templateUrl: './tenant-registrations-page.component.html',
  styleUrls: ['./tenant-registrations-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantRegistrationsPageComponent implements OnDestroy {
  public registrations$: Observable<GetRegistrationsQuery['registrations']>;
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
    private loadRegistrations: GetRegistrationsGQL
  ) {
    this.title.setTitle('TUMi - manage registrations');
    this.registrationsQueryRef = this.loadRegistrations.watch();
    this.registrationsQueryRef.startPolling(5000);
    this.registrations$ = this.registrationsQueryRef.valueChanges.pipe(
      map(({ data }) => data.registrations)
    );
  }

  ngOnDestroy() {
    this.registrationsQueryRef.stopPolling();
  }
}
