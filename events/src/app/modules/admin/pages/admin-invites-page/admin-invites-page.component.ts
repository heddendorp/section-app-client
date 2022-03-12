import { Component } from '@angular/core';
import { map, Observable, share } from 'rxjs';
import { GetInvitesGQL, GetInvitesQuery } from '@tumi/events/graphQL';

@Component({
  selector: 'app-admin-invites-page',
  templateUrl: './admin-invites-page.component.html',
  styleUrls: ['./admin-invites-page.component.scss'],
})
export class AdminInvitesPageComponent {
  public invites$: Observable<GetInvitesQuery['invites']>;
  public inviteNumber$: Observable<number>;
  public openInvites$: Observable<number>;
  public usedInvites$: Observable<number>;
  constructor(private getInvitesGQL: GetInvitesGQL) {
    this.invites$ = this.getInvitesGQL.watch().valueChanges.pipe(
      map(({ data }) => data.invites),
      share()
    );
    this.inviteNumber$ = this.invites$.pipe(map((invites) => invites.length));
    this.openInvites$ = this.invites$.pipe(
      map((invites) => invites.filter((invite) => !invite.redeemedAt).length)
    );
    this.usedInvites$ = this.invites$.pipe(
      map((invites) => invites.filter((invite) => invite.redeemedAt).length)
    );
  }
}
