import { Component } from '@angular/core';
import {
  GetInviteGQL,
  GetInviteQuery,
  UseInviteGQL,
} from '@tumi/events/graphQL';
import { firstValueFrom, map, Observable, share, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss'],
})
export class InviteComponent {
  public invite$: Observable<GetInviteQuery['invite']>;
  public loading$: Observable<boolean>;

  constructor(
    private getInviteGQL: GetInviteGQL,
    private useInviteGQL: UseInviteGQL,
    private route: ActivatedRoute
  ) {
    const valueChanges = this.route.paramMap.pipe(
      switchMap((params) =>
        this.getInviteGQL
          .watch({ id: params.get('id') ?? '' })
          .valueChanges.pipe(share())
      )
    );
    this.invite$ = valueChanges.pipe(map(({ data }) => data.invite));
    this.loading$ = valueChanges.pipe(map(({ loading }) => loading));
  }
  public async useInvite(invite: GetInviteQuery['invite']) {
    console.log('use invite', invite);
    await firstValueFrom(
      this.useInviteGQL.mutate({
        id: invite?.id ?? '',
      })
    );
  }
}
