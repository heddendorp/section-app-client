import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  firstValueFrom,
  Observable,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  GetRegistrationCodeInfoGQL,
  GetRegistrationCodeInfoQuery,
  UseRegistrationCodeGQL,
} from '@tumi/data-access';
import { map } from 'rxjs/operators';
import { Price } from '@tumi/shared/data-types';
import { PermissionsService } from '../../../../../auth/src/lib/services/permissions.service';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from '../../../../../../../apps/tumi-app/src/environments/environment';

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
  public availablePrices$: Observable<Price[]>;
  public priceControl = new FormControl(null, Validators.required);
  public codeControl = new FormControl('', Validators.pattern(this.idTest));
  public processing$ = new BehaviorSubject(false);
  public error$ = new BehaviorSubject('');
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { code?: string },
    private registrationCodeInfoGQL: GetRegistrationCodeInfoGQL,
    private useRegistrationCodeGQL: UseRegistrationCodeGQL,
    private permissions: PermissionsService
  ) {
    // private claimCode: ClaimEventGQL
    this.registrationCode$ = this.codeControl.valueChanges.pipe(
      startWith(this.data.code),
      filter((value) => this.idTest.test(value)),
      switchMap(
        (id) => this.registrationCodeInfoGQL.watch({ code: id }).valueChanges
      ),
      map(({ data }) => data.eventRegistrationCode),
      shareReplay(1)
    );
    this.availablePrices$ = this.registrationCode$.pipe(
      switchMap((code) =>
        this.permissions.getPricesForUser(
          code?.targetEvent?.prices?.options ?? []
        )
      ),
      tap((prices) => {
        const defaultPrice = prices.find((p) => p.defaultPrice);
        if (defaultPrice) {
          this.priceControl.setValue(defaultPrice);
        }
      })
    );
    if (this.data.code) {
      this.codeControl.patchValue(this.data.code, { emitEvent: true });
    }
  }

  async tryClaim() {
    this.processing$.next(true);
    this.error$.next('');
    const stripe = await loadStripe(environment.stripeKey);
    try {
      const { data } = await firstValueFrom(
        this.useRegistrationCodeGQL.mutate({
          id: this.codeControl.value,
          price: this.priceControl.value,
        })
      );
      
      if (data && stripe) {
        stripe.redirectToCheckout({
          sessionId:
            data.useRegistrationCode.registrationCreated?.payment
              ?.checkoutSession ?? '',
        });
      }
    } catch (e: unknown) {
      console.log(e);
      if (e instanceof Error) {
        this.error$.next(e.message);
      }
    }

    this.processing$.next(false);
  }

  async openCheckout(checkoutSession = '') {
    const stripe = await loadStripe(environment.stripeKey);
    if (stripe) {
      stripe.redirectToCheckout({
        sessionId: checkoutSession,
      });
    }
  }
}
