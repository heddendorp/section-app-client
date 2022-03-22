import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  GetUsersGQL,
  GetUsersQuery,
  MembershipStatus,
  Role,
  UpdateUserGQL,
} from '@tumi/data-access';
import { firstValueFrom, Observable, Subject } from 'rxjs';
import { debounceTime, map, shareReplay, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'tumi-tenant-users-page',
  templateUrl: './tenant-users-page.component.html',
  styleUrls: ['./tenant-users-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantUsersPageComponent implements OnInit, OnDestroy {
  public users$: Observable<GetUsersQuery['users']>;
  public userNum$: Observable<GetUsersQuery['userSearchResultNum']>;
  public displayedColumns = [
    'firstName',
    'lastName',
    'email',
    'status',
    'role',
    'action',
  ];
  public filterForm: FormGroup;
  public MembershipStatus = MembershipStatus;
  public Role = Role;
  private loadUsersReference;
  private destroyed$ = new Subject();
  constructor(
    private title: Title,
    private loadUsers: GetUsersGQL,
    private dialog: MatDialog,
    private updateMutation: UpdateUserGQL,
    private fb: FormBuilder,
    private clipboard: Clipboard
  ) {
    this.title.setTitle('TUMi - manage users');
    this.loadUsersReference = this.loadUsers.watch({
      pageLength: 20,
      pageIndex: 0,
    });
    this.users$ = this.loadUsersReference.valueChanges.pipe(
      map(({ data }) => data.users),
      shareReplay(1)
    );
    this.userNum$ = this.loadUsersReference.valueChanges.pipe(
      map(({ data }) => data.userSearchResultNum),
      shareReplay(1)
    );
    this.filterForm = this.fb.group({
      statusList: [Object.values(MembershipStatus)],
      roleList: [Object.values(Role)],
      search: [''],
    });
  }

  ngOnInit(): void {
    this.filterForm.valueChanges
      .pipe(takeUntil(this.destroyed$), debounceTime(500))
      .subscribe((value) => this.loadUsersReference.refetch(value));
  }
  ngOnDestroy(): void  {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  async copyMails() {
    const users = await firstValueFrom(this.users$);
    const pending = this.clipboard.beginCopy(
      users.map((user) => user.email).join(';')
    );
    let remainingAttempts = 3;
    const attempt = () => {
      const result = pending.copy();
      if (!result && --remainingAttempts) {
        setTimeout(attempt);
      } else {
        // Remember to destroy when you're done!
        pending.destroy();
      }
    };
    attempt();
  }

  updatePage($event: PageEvent): void  {
    this.loadUsersReference.refetch({
      pageIndex: $event.pageIndex,
      pageLength: $event.pageSize,
    });
  }
}
