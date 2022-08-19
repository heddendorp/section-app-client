import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  GetRegistrationForAdminGQL,
  GetRegistrationForAdminQuery,
} from '@tumi/legacy-app/generated/generated';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { Title } from '@angular/platform-browser';

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
    private route: ActivatedRoute,
    private title: Title
  ) {
    this.title.setTitle('Registration Details - TUMi');
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
