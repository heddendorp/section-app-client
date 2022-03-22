import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  GetUsersQuery,
  LoadUserGQL,
  LoadUserQuery,
  UpdateEsNcardGQL,
  UpdateUserGQL,
} from '@tumi/data-access';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { first, map, switchMap } from 'rxjs/operators';
import { UpdateUserDialogComponent } from '../../components/update-user-dialog/update-user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'tumi-tenant-user-info-page',
  templateUrl: './tenant-user-info-page.component.html',
  styleUrls: ['./tenant-user-info-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantUserInfoPageComponent {
  public user$: Observable<LoadUserQuery['userById']>;
  constructor(
    private loadUserQuery: LoadUserGQL,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private updateMutation: UpdateUserGQL,
    private updateCardMutation: UpdateEsNcardGQL
  ) {
    this.user$ = this.route.paramMap.pipe(
      switchMap(
        (params) =>
          this.loadUserQuery.watch({ id: params.get('userId') ?? '' })
            .valueChanges
      ),
      map(({ data }) => data.userById)
    );
  }

  async updateUser(user: GetUsersQuery['users'][0]) {
    const newUser = await this.dialog
      .open(UpdateUserDialogComponent, { data: { user } })
      .afterClosed()
      .toPromise();
    if (newUser) {
      await this.updateMutation
        .mutate({ id: user.id, role: newUser.role, status: newUser.status })
        .toPromise();
    }
  }

  async updateEsnCard(event: MatSlideToggleChange) {
    const user = await this.user$.pipe(first()).toPromise();
    if (user) {
      await this.updateCardMutation
        .mutate({
          userId: user.id,
          override: event.checked,
        })
        .toPromise();
    }
  }
}
