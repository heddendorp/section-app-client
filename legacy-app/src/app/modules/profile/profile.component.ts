import { ChangeDetectionStrategy, Component } from '@angular/core';
import { User } from '@tumi/models';
import { Invoice } from '@tumi/models/invoice';
import {
  AuthService,
  CountryService,
  EventService,
  UserService,
} from '@tumi/services';
import { InvoiceService } from '@tumi/services/invoice.service';
import { Observable } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';
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
  public user$: Observable<User>;
  public invoice$: Observable<Invoice>;
  public country$: Observable<string>;

  constructor(
    eventService: EventService,
    auth: AuthService,
    country: CountryService,
    private invoices: InvoiceService,
    private dialog: MatDialog,
    private userService: UserService
  ) {
    this.events$ = eventService.getEventsForCurrentUser();
    this.tutorEvents$ = eventService.getEventsForCurrentTutor();
    this.isTutor$ = auth.isTutor$;
    this.user$ = auth.user$;
    this.invoice$ = this.user$.pipe(
      switchMap((user) => this.invoices.getFirstForUserId(user.id))
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
