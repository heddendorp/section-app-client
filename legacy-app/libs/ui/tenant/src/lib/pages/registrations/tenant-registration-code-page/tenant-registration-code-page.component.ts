import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  GetEventRegistrationCodeGQL,
  GetEventRegistrationCodeQuery,
} from '@tumi/data-access';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tumi-tenant-registration-code-page',
  templateUrl: './tenant-registration-code-page.component.html',
  styleUrls: ['./tenant-registration-code-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantRegistrationCodePageComponent {
  public eventRegistrationCode$: Observable<
    GetEventRegistrationCodeQuery['eventRegistrationCode']
  >;

  constructor(
    private eventRegistrationCodeGQL: GetEventRegistrationCodeGQL,
    private route: ActivatedRoute
  ) {
    this.eventRegistrationCode$ = this.route.paramMap.pipe(
      switchMap(
        (params) =>
          this.eventRegistrationCodeGQL.watch({
            registrationId: params.get('codeId') ?? '',
          }).valueChanges
      ),
      map(({ data }) => data.eventRegistrationCode)
    );
  }
}
