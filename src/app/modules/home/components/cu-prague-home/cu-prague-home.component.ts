import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  GetHomePageDataGQL,
  GetHomePageDataQuery,
} from '@tumi/legacy-app/generated/generated';
import { Title } from '@angular/platform-browser';
import { TechnicalSupportComponent } from '../technical-support/technical-support.component';
import { NgOptimizedImage } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { onlyCompleteData } from 'apollo-angular';

@Component({
  selector: 'app-cu-prague-home',
  templateUrl: './cu-prague-home.component.html',
  styleUrls: ['./cu-prague-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    RouterLink,
    MatIconModule,
    TechnicalSupportComponent,
    NgOptimizedImage,
  ],
})
export class CuPragueHomeComponent {
  public events$: Observable<GetHomePageDataQuery['events']>;
  public loggedIn$: Observable<boolean>;

  constructor(
    private q: GetHomePageDataGQL,
    private title: Title,
  ) {
    this.title.setTitle('Home - CU Prague');

    this.events$ = this.q.watch().valueChanges.pipe(
      onlyCompleteData(),
      map(({ data }) => data.events),
    );
    this.loggedIn$ = this.q.watch().valueChanges.pipe(
      onlyCompleteData(),
      map(({ data }) => !!data.currentUser?.id),
    );
  }
}
