import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  GetUsersQuery,
  LoadUserGQL,
  LoadUserQuery,
  RegistrationStatus,
  UpdateEsNcardGQL,
  UpdateUserGQL,
} from '@tumi/legacy-app/generated/generated';
import { first, map, Observable, switchMap } from 'rxjs';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { UpdateUserDialogComponent } from '@tumi/legacy-app/modules/tenant/components/update-user-dialog/update-user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tenant-user-info-page',
  templateUrl: './tenant-user-info-page.component.html',
  styleUrls: ['./tenant-user-info-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantUserInfoPageComponent {
  public user$: Observable<LoadUserQuery['userById']>;
  public RegistrationStatus = RegistrationStatus;

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
