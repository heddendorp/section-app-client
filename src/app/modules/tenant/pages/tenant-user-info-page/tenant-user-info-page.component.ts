import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  GetUsersQuery,
  LoadUserGQL,
  LoadUserQuery,
  RegistrationStatus,
  UpdateEsNcardGQL,
  UpdateUserGQL,
} from '@tumi/legacy-app/generated/generated';
import { firstValueFrom, map, Observable, switchMap } from 'rxjs';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { UpdateUserDialogComponent } from '@tumi/legacy-app/modules/tenant/components/update-user-dialog/update-user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ExtendDatePipe } from '@tumi/legacy-app/modules/shared/pipes/extended-date.pipe';
import { MatRippleModule } from '@angular/material/core';
import { EventChipComponent } from '../../../shared/components/event-chip/event-chip.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { UserChipComponent } from '../../../shared/components/user-chip/user-chip.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf, AsyncPipe, TitleCasePipe, DatePipe } from '@angular/common';
import { ResetScrollDirective } from '../../../shared/directives/reset-scroll.directive';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveToolbarComponent } from '../../../shared/components/reactive-toolbar/reactive-toolbar.component';

@Component({
  selector: 'app-tenant-user-info-page',
  templateUrl: './tenant-user-info-page.component.html',
  styleUrls: ['./tenant-user-info-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveToolbarComponent,
    MatToolbarModule,
    BackButtonComponent,
    ResetScrollDirective,
    NgIf,
    MatProgressBarModule,
    UserChipComponent,
    MatButtonModule,
    MatSlideToggleModule,
    MatTableModule,
    EventChipComponent,
    MatRippleModule,
    RouterLink,
    AsyncPipe,
    TitleCasePipe,
    DatePipe,
    ExtendDatePipe,
  ],
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
  ) {
    this.user$ = this.route.paramMap.pipe(
      switchMap(
        (params) =>
          this.loadUserQuery.watch({ id: params.get('userId') ?? '' })
            .valueChanges,
      ),
      map(({ data }) => data.user),
    );
  }

  async updateUser(user: GetUsersQuery['users'][0]) {
    const newUser = await firstValueFrom(
      this.dialog
        .open(UpdateUserDialogComponent, {
          data: { user },
          panelClass: 'modern',
        })
        .afterClosed(),
    );
    if (newUser) {
      await firstValueFrom(
        this.updateMutation.mutate({
          id: user.id,
          role: newUser.role,
          status: newUser.status,
          position: newUser.position || null,
        }),
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
