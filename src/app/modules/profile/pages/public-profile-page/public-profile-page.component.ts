import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  UserProfilePublicGQL,
  UserProfilePublicQuery,
} from '@tumi/legacy-app/generated/generated';
import { map, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EventListItemComponent } from '../../../shared/components/event-list-item/event-list-item.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { ProfileCardComponent } from '../../components/profile-card/profile-card.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-public-profile-page',
  templateUrl: './public-profile-page.component.html',
  styleUrls: ['./public-profile-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    MatProgressBarModule,
    ProfileCardComponent,
    MatIconModule,
    MatListModule,
    NgFor,
    EventListItemComponent,
    AsyncPipe,
  ],
})
export class PublicProfilePageComponent {
  public profile$: Observable<UserProfilePublicQuery['user']>;
  public commonEvents$: Observable<UserProfilePublicQuery['commonEvents']>;
  public profileQueryRef;

  constructor(
    private profileQuery: UserProfilePublicGQL,
    private route: ActivatedRoute,
  ) {
    this.profileQueryRef = this.profileQuery.watch();

    this.route.paramMap.subscribe((params) =>
      this.profileQueryRef.refetch({ id: params.get('userId') ?? '' }),
    );

    this.profile$ = this.profileQueryRef.valueChanges.pipe(
      map(({ data }) => data.user),
    );
    this.commonEvents$ = this.profileQueryRef.valueChanges.pipe(
      map(({ data }) => data.commonEvents),
    );
  }
}
