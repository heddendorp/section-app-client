import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GetUsersGQL, GetUsersQuery, UpdateUserGQL } from '@tumi/data-access';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUserDialogComponent } from '../../components/update-user-dialog/update-user-dialog.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'tumi-tenant-users-page',
  templateUrl: './tenant-users-page.component.html',
  styleUrls: ['./tenant-users-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantUsersPageComponent implements OnInit {
  public users$: Observable<GetUsersQuery['users']>;
  public displayedColumns = [
    'firstName',
    'lastName',
    'status',
    'role',
    'action',
  ];
  constructor(
    private title: Title,
    private loadUsers: GetUsersGQL,
    private dialog: MatDialog,
    private updateMutation: UpdateUserGQL
  ) {
    this.title.setTitle('TUMi - manage users');
    this.users$ = this.loadUsers
      .watch()
      .valueChanges.pipe(map(({ data }) => data.users));
  }

  ngOnInit(): void {}

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
}
