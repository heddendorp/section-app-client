import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  GetEventRegistrationCodeGQL,
  GetEventRegistrationCodeQuery,
} from '@tumi/legacy-app/generated/generated';
import { map, Observable, switchMap } from 'rxjs';
import { ExtendDatePipe } from '@tumi/legacy-app/modules/shared/pipes/extended-date.pipe';
import { TransactionListComponent } from '../../../../shared/components/transaction-list/transaction-list.component';
import { MatButtonModule } from '@angular/material/button';
import { EventChipComponent } from '../../../../shared/components/event-chip/event-chip.component';
import { UserChipComponent } from '../../../../shared/components/user-chip/user-chip.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  AsyncPipe,
  DatePipe,
  LowerCasePipe,
  NgFor,
  NgIf,
} from '@angular/common';
import { ResetScrollDirective } from '../../../../shared/directives/reset-scroll.directive';
import { BackButtonComponent } from '../../../../shared/components/back-button/back-button.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveToolbarComponent } from '../../../../shared/components/reactive-toolbar/reactive-toolbar.component';

@Component({
  selector: 'app-tenant-registration-code-page',
  templateUrl: './tenant-registration-code-page.component.html',
  styleUrls: ['./tenant-registration-code-page.component.scss'],
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
    MatButtonModule,
    TransactionListComponent,
    NgFor,
    AsyncPipe,
    LowerCasePipe,
    DatePipe,
    ExtendDatePipe,
  ],
})
export class TenantRegistrationCodePageComponent {
  public eventRegistrationCode$: Observable<
    GetEventRegistrationCodeQuery['eventRegistrationCode']
  >;

  constructor(
    private eventRegistrationCodeGQL: GetEventRegistrationCodeGQL,
    private route: ActivatedRoute,
  ) {
    this.eventRegistrationCode$ = this.route.paramMap.pipe(
      switchMap(
        (params) =>
          this.eventRegistrationCodeGQL.watch({
            registrationId: params.get('codeId') ?? '',
          }).valueChanges,
      ),
      map(({ data }) => data.eventRegistrationCode),
    );
  }
}
