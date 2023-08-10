import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  GetRegistrationForAdminGQL,
  GetRegistrationForAdminQuery,
} from '@tumi/legacy-app/generated/generated';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { ExtendDatePipe } from '@tumi/legacy-app/modules/shared/pipes/extended-date.pipe';
import { MatButtonModule } from '@angular/material/button';
import { TransactionListComponent } from '../../../../shared/components/transaction-list/transaction-list.component';
import { EventChipComponent } from '../../../../shared/components/event-chip/event-chip.component';
import { UserChipComponent } from '../../../../shared/components/user-chip/user-chip.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf, AsyncPipe, DatePipe } from '@angular/common';
import { ResetScrollDirective } from '../../../../shared/directives/reset-scroll.directive';
import { BackButtonComponent } from '../../../../shared/components/back-button/back-button.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveToolbarComponent } from '../../../../shared/components/reactive-toolbar/reactive-toolbar.component';

@Component({
  selector: 'app-tenant-registration-details-page',
  templateUrl: './tenant-registration-details-page.component.html',
  styleUrls: ['./tenant-registration-details-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveToolbarComponent,
    MatToolbarModule,
    BackButtonComponent,
    ResetScrollDirective,
    NgIf,
    MatProgressBarModule,
    UserChipComponent,
    EventChipComponent,
    TransactionListComponent,
    MatButtonModule,
    AsyncPipe,
    DatePipe,
    ExtendDatePipe,
  ],
})
export class TenantRegistrationDetailsPageComponent {
  public registration$: Observable<
    GetRegistrationForAdminQuery['registration']
  >;

  constructor(
    private getRegistrationGQL: GetRegistrationForAdminGQL,
    private route: ActivatedRoute,
  ) {
    this.registration$ = this.route.paramMap.pipe(
      switchMap(
        (params) =>
          this.getRegistrationGQL.watch({
            id: params.get('registrationId') ?? '',
          }).valueChanges,
      ),
      map(({ data }) => data.registration),
    );
  }
}
