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
} from '@tumi/legacy-app/generated/generated';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  debounceTime,
  firstValueFrom,
  map,
  Observable,
  shareReplay,
  Subject,
  takeUntil,
} from 'rxjs';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { Clipboard } from '@angular/cdk/clipboard';
import { RouterLink } from '@angular/router';
import { UserChipComponent } from '../../../shared/components/user-chip/user-chip.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf, AsyncPipe, TitleCasePipe } from '@angular/common';
import { ResetScrollDirective } from '../../../shared/directives/reset-scroll.directive';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveToolbarComponent } from '../../../shared/components/reactive-toolbar/reactive-toolbar.component';

@Component({
  selector: 'app-tenant-users-page',
  templateUrl: './tenant-users-page.component.html',
  styleUrls: ['./tenant-users-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveToolbarComponent,
    MatToolbarModule,
    BackButtonComponent,
    ResetScrollDirective,
    NgIf,
    MatProgressBarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    UserChipComponent,
    MatRippleModule,
    RouterLink,
    MatPaginatorModule,
    AsyncPipe,
    TitleCasePipe,
  ],
})
export class TenantUsersPageComponent implements OnInit, OnDestroy {
  public users$: Observable<GetUsersQuery['users']>;
  public userNum$: Observable<GetUsersQuery['userSearchResultNum']>;
  public displayedColumns = [
    'profile',
    'firstName',
    'lastName',
    'email',
    'status',
    'role',
  ];
  public filterForm: UntypedFormGroup;
  public MembershipStatus = MembershipStatus;
  public Role = Role;
  private loadUsersReference;
  private destroyed$ = new Subject();

  constructor(
    private loadUsers: GetUsersGQL,
    private fb: UntypedFormBuilder,
    private clipboard: Clipboard,
  ) {
    this.loadUsersReference = this.loadUsers.watch({
      pageLength: 20,
      pageIndex: 0,
    });
    this.users$ = this.loadUsersReference.valueChanges.pipe(
      map(({ data }) => data.users),
      shareReplay(1),
    );
    this.userNum$ = this.loadUsersReference.valueChanges.pipe(
      map(({ data }) => data.userSearchResultNum),
      shareReplay(1),
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

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  async copyMails() {
    const users = await firstValueFrom(this.users$);
    const pending = this.clipboard.beginCopy(
      users.map((user) => user.email).join(';'),
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

  updatePage($event: PageEvent): void {
    this.loadUsersReference.refetch({
      pageIndex: $event.pageIndex,
      pageLength: $event.pageSize,
    });
  }
}
