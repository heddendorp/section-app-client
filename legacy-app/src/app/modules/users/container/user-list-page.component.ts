import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-user-list-page',
  template: `<h1>Users</h1>
    <p>The users overview will be back shortly</p>`,
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
export class UserListPageComponent {
  public users$: Observable<any[]>;
  constructor(private userService: UserService) {
    this.users$ = userService.tutors$;
  }
}
