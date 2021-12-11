import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GetHomePageDataGQL, GetHomePageDataQuery } from '@tumi/data-access';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'tumi-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
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
