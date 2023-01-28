import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  GetRegistrationForAdminGQL,
  GetRegistrationForAdminQuery,
} from '@tumi/legacy-app/generated/generated';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-tenant-registration-details-page',
  templateUrl: './tenant-registration-details-page.component.html',
  styleUrls: ['./tenant-registration-details-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantRegistrationDetailsPageComponent {
  public registration$: Observable<
    GetRegistrationForAdminQuery['registration']
  >;

  constructor(
    private getRegistrationGQL: GetRegistrationForAdminGQL,
    private route: ActivatedRoute
  ) {
    this.registration$ = this.route.paramMap.pipe(
      switchMap(
        (params) =>
          this.getRegistrationGQL.watch({
            id: params.get('registrationId') ?? '',
          }).valueChanges
      ),
      map(({ data }) => data.registration)
    );
  }
}
