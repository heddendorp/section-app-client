import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  GetUsersQuery,
  LoadUserGQL,
  LoadUserQuery,
  RegistrationStatus,
  UpdateEsNcardGQL,
  UpdateUserGQL,
} from '@tumi/legacy-app/generated/generated';
import { tap, firstValueFrom, map, Observable, switchMap } from 'rxjs';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { UpdateUserDialogComponent } from '@tumi/legacy-app/modules/tenant/components/update-user-dialog/update-user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-tenant-user-info-page',
  templateUrl: './tenant-user-info-page.component.html',
  styleUrls: ['./tenant-user-info-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantUserInfoPageComponent {
  public user$: Observable<LoadUserQuery['user']>;
  public RegistrationStatus = RegistrationStatus;

  public displayedColumns = [
    'event',
    'eventStart',
    'type',
    'status',
    'registrationDate',
    'checkInDate',
  ];

  constructor(
    private loadUserQuery: LoadUserGQL,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private updateMutation: UpdateUserGQL,
    private updateCardMutation: UpdateEsNcardGQL,
    private title: Title
  ) {
    this.user$ = this.route.paramMap.pipe(
      switchMap(
        (params) =>
          this.loadUserQuery.watch({ id: params.get('userId') ?? '' })
            .valueChanges
      ),
      map(({ data }) => data.user),
      tap((user) => this.title.setTitle(`User ${user.fullName} - TUMi`))
    );
  }

  async updateUser(user: GetUsersQuery['users'][0]) {
    const newUser = await firstValueFrom(
      this.dialog
        .open(UpdateUserDialogComponent, {
          data: { user },
          panelClass: 'modern',
        })
        .afterClosed()
    );
    if (newUser) {
      await firstValueFrom(
        this.updateMutation.mutate({
          id: user.id,
          role: newUser.role,
          status: newUser.status,
          position: newUser.position || null,
        })
      );
    }
  }

  async updateEsnCard(event: MatSlideToggleChange) {
    const user = await firstValueFrom(this.user$);
    if (user) {
      await this.updateCardMutation
        .mutate({
          userId: user.id,
          override: event.checked,
        })
        .toPromise();
    }
  }

  waLink(phone?: string | null) {
    return `https://wa.me/${phone?.replace('+', '')}`;
  }
}
