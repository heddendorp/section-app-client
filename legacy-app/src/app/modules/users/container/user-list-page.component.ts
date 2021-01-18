import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from '@tumi/models';
import { UserService } from '@tumi/services';
import { Observable } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-user-list-page',
  template: `<h1
      class="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-accent-600 to-accent-500"
    >
      Users
    </h1>
    <mat-form-field class="w-full my-4">
      <mat-label>Search User</mat-label>
      <input matInput [formControl]="searchControl" type="search" />
      <mat-hint
        >Only users that signed in in the lat six months are displayed</mat-hint
      >
    </mat-form-field>
    <app-user-table [users]="users$ | ngrxPush"></app-user-table>`,
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
  public users$: Observable<User[]>;
  public searchControl = new FormControl('');

  constructor(private userService: UserService) {
    this.users$ = userService.users$.pipe(
      switchMap((users) =>
        this.searchControl.valueChanges.pipe(
          startWith(this.searchControl.value),
          map((value) =>
            users.filter(
              (user) =>
                !value ||
                user.email
                  .toLocaleLowerCase()
                  .includes(value.toLocaleLowerCase())
            )
          )
        )
      )
    );
  }
}
