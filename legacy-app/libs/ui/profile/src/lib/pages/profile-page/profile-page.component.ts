import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import {
  GetPaymentSetupSessionGQL,
  UserProfileGQL,
  UserProfileQuery,
} from '@tumi/data-access';
import { first, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { loadStripe } from '@stripe/stripe-js/pure';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { environment } from '../../../../../../../apps/tumi-app/src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tumi-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent implements OnDestroy {
  public profile$: Observable<UserProfileQuery['currentUser']>;
  public profileQueryRef;
  constructor(
    private profileQuery: UserProfileGQL,
    private getStripeSession: GetPaymentSetupSessionGQL,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.profileQueryRef = this.profileQuery.watch();
    this.profileQueryRef.startPolling(5000);
    this.profile$ = this.profileQueryRef.valueChanges.pipe(
      map(({ data }) => data.currentUser)
    );
    this.route.queryParamMap.pipe(first()).subscribe((queryMap) => {
      const status = queryMap.get('stripe');
      if (status === 'success') {
        this.snackBar.open('✔️ We are processing your payment method...');
      }
      if (status === 'fail') {
        this.snackBar.open('❌ The process was cancelled');
      }
    });
  }
  ngOnDestroy() {
    this.profileQueryRef.stopPolling();
  }

  async setupStripePayment() {
    const { data } = await this.getStripeSession.fetch().toPromise();
    const stripe = await loadStripe(environment.stripeKey);
    if (stripe) {
      await stripe.redirectToCheckout({
        sessionId: data.getPaymentSetupSession.id,
      });
    }
  }
}
