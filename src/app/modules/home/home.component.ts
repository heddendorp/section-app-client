import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GetHomePageTenantInfoGQL } from '@tumi/legacy-app/generated/generated';
import { map, Observable } from 'rxjs';
import { AugsburgHomeComponent } from './components/augsburg-home/augsburg-home.component';
import { TumiHomeComponent } from './components/tumi-home/tumi-home.component';
import { AsyncPipe, NgSwitch, NgSwitchCase } from '@angular/common';
import { CuPragueHomeComponent } from '@tumi/legacy-app/modules/home/components/cu-prague-home/cu-prague-home.component';
import { VubEhbHomeComponent } from '@tumi/legacy-app/modules/home/components/vub-ehb-home/vub-ehb-home.component';
import { KaiserslauternHomeComponent } from '@tumi/legacy-app/modules/home/components/kaiserslautern-home/kaiserslautern-home.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgSwitch,
    NgSwitchCase,
    TumiHomeComponent,
    AugsburgHomeComponent,
    AsyncPipe,
    CuPragueHomeComponent,
    VubEhbHomeComponent,
    KaiserslauternHomeComponent,
  ],
})
export class HomeComponent {
  protected shortName$: Observable<string>;

  constructor(getHomePageTenantInfoGQL: GetHomePageTenantInfoGQL) {
    this.shortName$ = getHomePageTenantInfoGQL
      .watch()
      .valueChanges.pipe(map(({ data }) => data.currentTenant.shortName));
  }
}
