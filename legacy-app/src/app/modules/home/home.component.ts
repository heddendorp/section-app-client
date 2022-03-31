import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  GetHomePageDataGQL,
  GetHomePageDataQuery,
} from '@tumi/legacy-app/generated/generated';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  public events$: Observable<GetHomePageDataQuery['events']>;
  public loggedIn$: Observable<boolean>;

  constructor(private q: GetHomePageDataGQL) {
    this.events$ = this.q
      .watch()
      .valueChanges.pipe(map(({ data }) => data.events));
    this.loggedIn$ = this.q
      .watch()
      .valueChanges.pipe(map(({ data }) => !!data.currentUser?.id));
  }
}
