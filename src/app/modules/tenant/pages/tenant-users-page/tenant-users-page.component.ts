import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  inject,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { UserGridComponent } from '@tumi/legacy-app/components/user-grid/user-grid/user-grid.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BulkUpdateStatusDialogComponent } from './bulk-update-status-dialog.component';
import { Apollo, gql } from 'apollo-angular';
import { MembershipStatus } from '@tumi/legacy-app/generated/generated';
import { firstValueFrom } from 'rxjs';

const UPDATE_USERS_STATUS_BULK = gql`
  mutation updateUsersStatusBulk($userIds: [ID!]!, $status: MembershipStatus!) {
    updateUsersStatusBulk(userIds: $userIds, status: $status) {
      userId
      tenantId
      status
    }
  }
`;

@Component({
  selector: 'app-tenant-users-page',
  templateUrl: './tenant-users-page.component.html',
  styleUrls: ['./tenant-users-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatButton, MatDialogModule, UserGridComponent],
})
export class TenantUsersPageComponent {
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private apollo = inject(Apollo);

  @ViewChild('gridComponent') gridComponent?: UserGridComponent;

  public selectedUserIds: string[] = [];

  onSelectionChanged(ids: string[]) {
    this.selectedUserIds = ids ?? [];
  }

  async openBulkUpdateDialog() {
    if (!this.selectedUserIds.length) return;
    const ref = this.dialog.open(BulkUpdateStatusDialogComponent, {
      width: '420px',
    });
    const result = await firstValueFrom(ref.afterClosed());
    if (!result?.status) return;

    try {
      await firstValueFrom(
        this.apollo.mutate<{ updateUsersStatusBulk: any[] }>({
          mutation: UPDATE_USERS_STATUS_BULK,
          variables: {
            userIds: this.selectedUserIds,
            status: result.status as MembershipStatus,
          },
        }),
      );
      // Refresh the grid and clear selection
      this.gridComponent?.refreshAfterMutation();
      this.selectedUserIds = [];
      // Optionally provide user feedback here
      // console.log('Statuses updated');
    } catch (e) {
      // console.error('Bulk update failed', e);
    }
  }

  rowClicked(id: string) {
    void this.router.navigate(['tenant', 'users', id]);
  }
}
