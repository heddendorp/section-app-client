import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MemberStatus, User } from '@tumi/models';
import {
  ConfirmDialogComponent,
  IconToastComponent,
} from '@tumi/modules/shared';
import { EventService, UserService } from '@tumi/services';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, shareReplay, switchMap, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styles: [
    `
      :host {
        display: block;
        padding: 1rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsComponent implements OnInit {
  public user$: Observable<User>;
  public events$: Observable<any[]>;
  public tutoredEvents$: Observable<any[]>;
  public showEvents$ = new BehaviorSubject(false);
  public showTutorEvents$ = new BehaviorSubject(false);
  userForm: FormGroup;
  MemberStatus = MemberStatus;
  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private eventService: EventService,
    private dialog: MatDialog,
    fb: FormBuilder
  ) {
    this.userForm = fb.group({
      status: [this.MemberStatus.none],
      onAlumniMailingList: [false],
    });
  }

  public ngOnInit(): void {
    this.userForm.valueChanges.subscribe((data) => console.log(data));
    this.user$ = this.route.paramMap.pipe(
      switchMap((params) => this.userService.getOne$(params.get('id') ?? '')),
      tap((user) => console.log(user)),
      tap((user) => this.userForm.patchValue(user)),
      shareReplay(1)
    );
    this.events$ = this.user$.pipe(
      switchMap((user) => this.eventService.getEventsForUser(user.id))
    );
    this.tutoredEvents$ = this.user$.pipe(
      switchMap((user) => this.eventService.getEventsForTutor(user.id))
    );
  }

  async saveChanges() {
    const user = await this.user$.pipe(first()).toPromise();
    const update = this.userForm.value;
    await this.userService.update(user.id, update);
    this.snackBar.openFromComponent(IconToastComponent, {
      data: {
        message: `User updated!`,
        icon: 'icon-checkmark',
      },
    });
  }

  async removeUserdata() {
    const user = await this.user$.pipe(first()).toPromise();
    const proceed = await this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: `Do you really want to remove all data for this user?`,
          result: true,
        },
      })
      .afterClosed()
      .toPromise();
    if (proceed) {
      user.removeData();
      await this.userService.update(user.id, user);
    }
  }
}
