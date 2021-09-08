import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UserProfileGQL, UserProfileQuery } from '@tumi/data-access';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'tumi-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent implements OnInit {
  public profile$: Observable<UserProfileQuery['currentUser']>;
  constructor(private profileQuery: UserProfileGQL) {
    this.profile$ = this.profileQuery
      .watch()
      .valueChanges.pipe(map(({ data }) => data.currentUser));
  }

  ngOnInit(): void {}
}
