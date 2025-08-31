import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { UserGridComponent } from '@tumi/legacy-app/components/user-grid/user-grid/user-grid.component';

@Component({
  selector: 'app-tenant-users-page',
  templateUrl: './tenant-users-page.component.html',
  styleUrls: ['./tenant-users-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatButton, UserGridComponent],
})
export class TenantUsersPageComponent {
  private router = inject(Router);
  public selectedUserIds: string[] = [];

  onSelectionChanged(ids: string[]) {
    this.selectedUserIds = ids ?? [];
  }

  rowClicked(id: string) {
    void this.router.navigate(['tenant', 'users', id]);
  }
}
