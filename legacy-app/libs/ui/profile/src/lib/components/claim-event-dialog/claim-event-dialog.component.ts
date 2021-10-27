import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { BehaviorSubject, filter, Observable, switchMap } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  GetRegistrationCodeInfoGQL,
  GetRegistrationCodeInfoQuery,
} from '@tumi/data-access';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tumi-claim-event-dialog',
  templateUrl: './claim-event-dialog.component.html',
  styleUrls: ['./claim-event-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClaimEventDialogComponent {
  public idTest = new RegExp(
    /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  );
  public registrationCode$: Observable<
    GetRegistrationCodeInfoQuery['eventRegistrationCode']
  >;
  public codeControl = new FormControl('', Validators.pattern(this.idTest));
  public processing$ = new BehaviorSubject(false);
  public error$ = new BehaviorSubject('');
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { code?: string },
    private registrationCodeInfoGQL: GetRegistrationCodeInfoGQL
  ) {
    // private claimCode: ClaimEventGQL
    this.registrationCode$ = this.codeControl.valueChanges.pipe(
      filter((value) => this.idTest.test(value)),
      switchMap(
        (id) => this.registrationCodeInfoGQL.watch({ code: id }).valueChanges
      ),
      map(({ data }) => data.eventRegistrationCode)
    );
    if (this.data.code) {
      this.codeControl.patchValue(this.data.code, { emitEvent: true });
    }
  }

  async tryClaim() {
    this.processing$.next(true);
    this.error$.next('');
    // try {
    //   const { data } = await firstValueFrom(
    //     this.claimCode.mutate({ id: this.codeControl.value })
    //   );
    //   if (
    //     data?.useMoveOrder.status === 'requires_action' &&
    //     data?.useMoveOrder.client_secret
    //   ) {
    //     this.error$.next('⚠️ Additional information needed, please wait');
    //     const stripe = await loadStripe(environment.stripeKey);
    //     if (stripe) {
    //       await stripe.confirmCardPayment(data?.useMoveOrder.client_secret);
    //     }
    //     this.error$.next('');
    //   }
    // } catch (e) {
    //   this.error$.next(e.message);
    // }
    this.processing$.next(false);
  }
}
