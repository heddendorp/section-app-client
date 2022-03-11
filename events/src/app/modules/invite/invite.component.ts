import { Component } from '@angular/core';
import {
  GetInviteGQL,
  GetInviteQuery,
  UseInviteGQL,
} from '@tumi/events/graphQL';
import { firstValueFrom, map, Observable, share, switchMap, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss'],
})
export class InviteComponent {
  public invite$: Observable<GetInviteQuery['invite']>;
  public loading$: Observable<boolean>;
  public authenticated$: Observable<boolean>;

  constructor(
    private getInviteGQL: GetInviteGQL,
    private useInviteGQL: UseInviteGQL,
    private auth: AuthService,
    private route: ActivatedRoute,
    private meta: Meta,
    private title: Title
  ) {
    const valueChanges = this.route.paramMap.pipe(
      switchMap((params) =>
        this.getInviteGQL
          .watch({ id: params.get('id') ?? '' })
          .valueChanges.pipe(share())
      ),
      tap((invite) => {
        this.title.setTitle(
          `Invitation to ${invite.data.invite?.tenant?.name}`
        );
        meta.updateTag(
          {
            name: 'og:title',
            content: `Invitation to ${invite.data.invite?.tenant?.name}`,
          },
          'name="og:title"'
        );
      })
    );
    this.invite$ = valueChanges.pipe(map(({ data }) => data.invite));
    this.loading$ = valueChanges.pipe(map(({ loading }) => loading));
    this.authenticated$ = this.auth.isAuthenticated$;
  }
  public async useInvite(invite: GetInviteQuery['invite']) {
    await firstValueFrom(
      this.useInviteGQL.mutate({
        id: invite?.id ?? '',
      })
    );
  }
}
