import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EventService, TumiEvent } from '../../shared/services/event.service';
import { first, map } from 'rxjs/operators';
import { AuthService } from '../../shared/services/auth.service';
import { Student, UserService } from '../../shared/services/user.service';
import { UserDataChangeComponent } from '../../shared/components/user-data-change/user-data-change.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IconToastComponent } from '../../shared/components/icon-toast/icon-toast.component';

@Component({
  selector: 'app-registered-list',
  templateUrl: './registered-list.component.html',
  styleUrls: ['./registered-list.component.scss']
})
export class RegisteredListComponent implements OnInit {
  upcomingEvents$: Observable<TumiEvent[]>;
  passedEvents$: Observable<TumiEvent[]>;
  user$: Observable<Student>;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private dialog: MatDialog,
    public userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.upcomingEvents$ = this.eventService.registeredEvents.pipe(
      map(events => events.filter(event => event.start.isAfter()))
    );
    this.passedEvents$ = this.eventService.registeredEvents.pipe(
      map(events => events.filter(event => event.start.isBefore()))
    );
    this.user$ = this.authService.user;
  }

  async sendVerification() {
    await this.authService.sendVerification();
    this.snackBar.openFromComponent(IconToastComponent, {
      data: {
        message: 'Email sent, please check your mail!',
        icon: 'check-mail'
      }
    });
  }

  async changeData() {
    const user = await this.user$.pipe(first()).toPromise();
    const result = await this.dialog
      .open(UserDataChangeComponent, { data: { user }, disableClose: true })
      .afterClosed()
      .toPromise();
    if (result) {
      await this.userService.save(result);
    }
  }
}
