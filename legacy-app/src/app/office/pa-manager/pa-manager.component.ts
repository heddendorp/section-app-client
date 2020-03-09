import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UsersState } from '../../shared/state/users.state';
import { Student } from '../../shared/services/user.service';
import { LoadPaUsers, MarkApplicationInternal } from '../../shared/state/users.actions';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-pa-manager',
  templateUrl: './pa-manager.component.html',
  styleUrls: ['./pa-manager.component.scss']
})
export class PaManagerComponent implements OnInit {
  @Select(UsersState.loaded) loaded$: Observable<boolean>;
  @Select(UsersState.paRegistrations) registrations$: Observable<Student[]>;
  @Select(UsersState.paStartedRegistrations) inProgress$: Observable<Student[]>;
  @Select(UsersState.paInternalRegistrations) internal$: Observable<Student[]>;
  registrationNum$ = this.registrations$.pipe(
    map(registrations => registrations.length)
  );
  registrationFNum$ = this.registrations$.pipe(
    map(registrations => registrations.filter(registration => registration.gender === 'f').length)
  );
  registrationMNum$ = this.registrations$.pipe(
    map(registrations => registrations.filter(registration => registration.gender !== 'f').length)
  );

  constructor(private store: Store, private dialog: MatDialog) {
  }

  async ngOnInit() {
    await this.store.dispatch(new LoadPaUsers()).toPromise();
  }

  async markAsInternal(user) {
    const confirm = await this.dialog
      .open(ConfirmationDialogComponent, {
        data: { text: `Are you sure you want to mark the application (${user.email}) as internal Test?` }
      })
      .afterClosed()
      .toPromise();
    if (confirm) {
      await this.store.dispatch(new MarkApplicationInternal(user)).toPromise();
    }
  }
}
