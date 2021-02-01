import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MemberStatus, User } from '@tumi/models';
import { ConfirmDialogComponent } from '@tumi/modules/shared';
import { EventService, UserService } from '@tumi/services';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-details',
  template: `<ng-container *ngIf="user$ | async as user">
    <h2>{{ user.name }}</h2>
    <p>{{ user.email }}</p>
    <p>Member status {{ user.status }}</p>
    <button
      mat-flat-button
      color="warn"
      (click)="removeUserdata()"
      [disabled]="user.isMember"
    >
      Remove userdata
    </button>
    <button
      mat-flat-button
      (click)="showEvents$.next(true)"
      [disabled]="showEvents$ | ngrxPush"
    >
      Load attended events
    </button>
    <button mat-flat-button (click)="makeFullMember()">Make full member</button>
    <mat-list *ngIf="showEvents$ | async">
      <mat-list-item *ngFor="let event of events$ | ngrxPush">
        <img [appIconSrc]="event.icon" [alt]="event.icon" mat-list-avatar />
        <p mat-line>{{ event.name }}</p>
      </mat-list-item>
    </mat-list>
  </ng-container>`,
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
  public showEvents$ = new BehaviorSubject(false);
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private eventService: EventService,
    private dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.user$ = this.route.paramMap.pipe(
      switchMap((params) => this.userService.getUser$(params.get('id') ?? ''))
    );
    this.events$ = this.user$.pipe(
      switchMap((user) => this.eventService.getEventsForUser(user.id))
    );
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

  public async makeFullMember() {
    const user = await this.user$.pipe(first()).toPromise();
    const proceed = await this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: `Do you really want to make ${user.name} a full member?`,
          result: true,
        },
      })
      .afterClosed()
      .toPromise();
    if (proceed) {
      user.status = MemberStatus.full;
      user.joinedAssociation = new Date('10/01/2020 20:00');
      await this.userService.update(user.id, user);
    }
  }
}
