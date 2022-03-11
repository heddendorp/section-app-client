import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GetInvitesGQL, GetInvitesQuery } from '@tumi/events/graphQL';

@Component({
  selector: 'app-admin-invites-page',
  templateUrl: './admin-invites-page.component.html',
  styleUrls: ['./admin-invites-page.component.scss'],
})
export class AdminInvitesPageComponent {
  public invites$: Observable<GetInvitesQuery['invites']>;

  constructor(private getInvitesGQL: GetInvitesGQL) {
    this.invites$ = this.getInvitesGQL
      .watch()
      .valueChanges.pipe(map(({ data }) => data.invites));
  }
}
