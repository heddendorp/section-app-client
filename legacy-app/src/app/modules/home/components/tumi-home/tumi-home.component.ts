import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  GetHomePageDataGQL,
  GetHomePageDataQuery,
} from '@tumi/legacy-app/generated/generated';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-tumi-home',
  templateUrl: './tumi-home.component.html',
  styleUrls: ['./tumi-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TumiHomeComponent {
  public events$: Observable<GetHomePageDataQuery['events']>;
  public loggedIn$: Observable<boolean>;

  constructor(private q: GetHomePageDataGQL, private title: Title) {
    this.title.setTitle('Home - TUMi');

    this.events$ = this.q
      .watch()
      .valueChanges.pipe(map(({ data }) => data.events));
    this.loggedIn$ = this.q
      .watch()
      .valueChanges.pipe(map(({ data }) => !!data.currentUser?.id));
  }
}
