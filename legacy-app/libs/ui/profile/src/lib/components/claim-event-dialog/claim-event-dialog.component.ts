import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ClaimEventGQL,
  GetMoveOrderGQL,
  GetMoveOrderQuery,
} from '@tumi/data-access';
import { FormControl, Validators } from '@angular/forms';
import { filter, map, switchMap } from 'rxjs/operators';
import { loadStripe } from '@stripe/stripe-js/pure';
import { environment } from '../../../../../../../apps/tumi-app/src/environments/environment';

@Component({
  selector: 'tumi-claim-event-dialog',
  templateUrl: './claim-event-dialog.component.html',
  styleUrls: ['./claim-event-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClaimEventDialogComponent implements OnInit {
  public idTest = new RegExp(
    /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  );
  public moveOrder$: Observable<GetMoveOrderQuery['moveOrder']>;
  public codeControl = new FormControl('', Validators.pattern(this.idTest));
  public processing$ = new BehaviorSubject(false);
  public error$ = new BehaviorSubject('');
  constructor(
    private getMoveOrder: GetMoveOrderGQL,
    private claimCode: ClaimEventGQL
  ) {
    this.moveOrder$ = this.codeControl.valueChanges.pipe(
      filter((value) => this.idTest.test(value)),
      switchMap((id) => this.getMoveOrder.watch({ orderId: id }).valueChanges),
      map(({ data }) => data.moveOrder)
    );
  }

  ngOnInit(): void {}

  async tryClaim() {
    this.processing$.next(true);
    this.error$.next('');
    try {
      const { data } = await this.claimCode
        .mutate({ id: this.codeControl.value })
        .toPromise();
      if (
        data?.useMoveOrder.status === 'requires_action' &&
        data?.useMoveOrder.client_secret
      ) {
        this.error$.next('⚠️ Additional information needed, please wait');
        const stripe = await loadStripe(environment.stripeKey);
        if (stripe) {
          await stripe.confirmCardPayment(data?.useMoveOrder.client_secret);
        }
        this.error$.next('');
      }
    } catch (e) {
      this.error$.next(e.message);
    }
    this.processing$.next(false);
  }
}
