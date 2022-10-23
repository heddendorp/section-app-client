import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  UserProfilePublicGQL,
  UserProfilePublicQuery,
} from '@tumi/legacy-app/generated/generated';
import { map, Observable, tap } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-public-profile-page',
  templateUrl: './public-profile-page.component.html',
  styleUrls: ['./public-profile-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicProfilePageComponent {
  public profile$: Observable<UserProfilePublicQuery['user']>;
  public commonEvents$: Observable<UserProfilePublicQuery['commonEvents']>;
  public profileQueryRef;
  constructor(
    private title: Title,
    private profileQuery: UserProfilePublicGQL,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.title.setTitle('Profile - TUMi');
    this.profileQueryRef = this.profileQuery.watch();

    this.route.paramMap.subscribe((params) =>
      this.profileQueryRef.refetch({ id: params.get('userId') ?? '' })
    );

    this.profile$ = this.profileQueryRef.valueChanges.pipe(
      map(({ data, errors }) => {
        if (errors) {
          router.navigate(['404'])
        }
        return data.user
      }),
      tap((user) => {
        this.title.setTitle(`${user.fullName} - TUMi`);
      })
    );
    this.commonEvents$ = this.profileQueryRef.valueChanges.pipe(
      map(({ data }) => data.commonEvents)
    );
  }
}
