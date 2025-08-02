import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { UserGridComponent } from '@tumi/legacy-app/components/user-grid/user-grid/user-grid.component';

@Component({
  selector: 'app-tenant-users-page',
  templateUrl: './tenant-users-page.component.html',
  styleUrls: ['./tenant-users-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AgGridAngular, MatButton, MatIcon, UserGridComponent],
})
export class TenantUsersPageComponent {
  private router = inject(Router);

  rowClicked(id: string) {
    void this.router.navigate(['tenant', 'users', id]);
  }
}
