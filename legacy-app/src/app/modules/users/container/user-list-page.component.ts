import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from '@tumi/models';
import { UserService } from '@tumi/services';
import { SearchService } from '@tumi/services/search.service';
import { Observable } from 'rxjs';
import { exhaustMap, map, startWith, switchMap, tap } from 'rxjs/operators';

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
      <mat-hint *ngrxLet="searchStream$; let search">
        Showing
        {{ search.nbPages === 1 ? search.nbHits : search.hitsPerPage }} of
        {{ search.nbHits }} results
      </mat-hint>
    </mat-form-field>
    <app-user-table [users]="results$ | ngrxPush"></app-user-table>`,
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
  public results$: Observable<any>;
  public searchStream$: Observable<any>;
  public searchControl = new FormControl('');

  constructor(private search: SearchService) {
    this.searchStream$ = this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value),
      exhaustMap((query) => this.search.find(query))
    );
    this.results$ = this.searchStream$.pipe(map((search) => search.hits));
  }
}
