import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  AuthService,
  CountryService,
  EventService,
  UserService,
} from '@tumi/services';
import { Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { getType } from '../shared';
import { MatDialog } from '@angular/material/dialog';
import { ProfileDialogComponent } from './components/profile-dialog/profile-dialog.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  public events$: Observable<any[]>;
  public tutorEvents$: Observable<any[]>;
  public isTutor$: Observable<boolean>;
  public user$: Observable<any>;
  public country$: Observable<string>;

  constructor(
    eventService: EventService,
    auth: AuthService,
    country: CountryService,
    private dialog: MatDialog,
    private userService: UserService
  ) {
    this.events$ = eventService.getEventsForCurrentUser();
    this.tutorEvents$ = eventService.getEventsForCurrentTutor();
    this.isTutor$ = auth.isTutor$;
    this.user$ = auth.user$.pipe(
      map((user) => ({ ...user, friendlyType: getType(user.type) }))
    );
    this.country$ = this.user$.pipe(
      switchMap((user) => country.getName(user.country))
    );
  }

  public async editProfile(): Promise<void> {
    const user = await this.user$.pipe(first()).toPromise();
    const update = await this.dialog
      .open(ProfileDialogComponent, { data: user })
      .afterClosed()
      .toPromise();
    if (update) {
      await this.userService.update(user.id, update);
    }
  }
}
