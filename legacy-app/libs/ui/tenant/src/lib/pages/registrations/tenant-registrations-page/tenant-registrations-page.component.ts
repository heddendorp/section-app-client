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
    // this.registrations$.subscribe((registrations) => {
    //   const feeRegistrations = registrations.filter((reg) => reg.stripeFee);
    //   const totalPaid = feeRegistrations.reduce(
    //     (previousValue, currentValue) =>
    //       previousValue + (currentValue.amountPaid ?? 0) - 25,
    //     0
    //   );
    //   const totalFees = feeRegistrations.reduce(
    //     (previousValue, currentValue) =>
    //       previousValue + (currentValue.stripeFee ?? 0) - 25,
    //     0
    //   );
    //   console.log(feeRegistrations.length);
    //   console.log(totalPaid / 100);
    //   console.log(totalFees / 100);
    //   console.log((totalFees / totalPaid) * 100);
    //   console.log((25 * feeRegistrations.length) / 100);
    // });
  }

  ngOnDestroy(): void  {
    this.registrationsQueryRef.stopPolling();
  }
}
