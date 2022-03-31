import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  GetEventRegistrationCodeGQL,
  GetEventRegistrationCodeQuery,
} from '@tumi/legacy-app/generated/generated';
import { map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-tenant-registration-code-page',
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
