import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { CountryService } from '../../services/country.service';
import { getType } from '../shared';
import { MatDialog } from '@angular/material/dialog';
import { ProfileDialogComponent } from './components/profile-dialog/profile-dialog.component';
import { UserService } from '../../services/user.service';

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
    private user: UserService
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
      await this.user.update(user.id, update);
    }
  }
}
