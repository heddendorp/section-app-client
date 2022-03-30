import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  LoadEventsForInsuranceGQL,
  LoadEventsForInsuranceQuery,
} from '@tumi/data-access';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tumi-tenant-insurance-page',
  templateUrl: './tenant-insurance-page.component.html',
  styleUrls: ['./tenant-insurance-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantInsurancePageComponent {
  events$: Observable<LoadEventsForInsuranceQuery['events']>;

  constructor(private loadEventsForInsuranceGQL: LoadEventsForInsuranceGQL) {
    this.events$ = this.loadEventsForInsuranceGQL.watch().valueChanges.pipe(
      map(({ data }) => data.events),
      map((events) =>
        events
          .filter((event) => event.shouldBeReportedToInsurance)
          .filter((event) => event.publicationState === 'PUBLIC')
          .filter(
            (event) =>
              event.organizer.id === '06166e2f-5302-41b0-a22c-8bf952cb2128'
          )
      )
    );
  }
}
