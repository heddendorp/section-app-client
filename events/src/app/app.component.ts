import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { PermissionService } from './services/permission.service';
import { map, Observable, share } from 'rxjs';
import { RootInfoGQL, RootInfoQuery } from '@tumi/events/graphQL';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public isMember$: Observable<boolean>;
  public isAdmin$: Observable<boolean>;
  public incompleteProfile$: Observable<boolean>;
  private rootInfo$: Observable<RootInfoQuery>;
  constructor(
    public auth: AuthService,
    public permissions: PermissionService,
    private rootInfoGQL: RootInfoGQL
  ) {
    this.isAdmin$ = this.permissions.hasRole('Admin');
    this.isMember$ = this.permissions.hasStatus('Full', 'Trial', 'Sponsor');
    this.rootInfo$ = this.rootInfoGQL.watch().valueChanges.pipe(
      map((result) => result.data),
      share()
    );
    this.incompleteProfile$ = this.rootInfo$.pipe(
      map((rootInfo) => {
        return rootInfo.currentUser?.profileComplete === false;
      })
    );
  }
}
