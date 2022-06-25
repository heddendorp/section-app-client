import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import {
  MembershipStatus,
  SubmitEventFeedbackGQL,
  UpdateProfileGQL,
  UserProfileGQL,
  UserProfileQuery,
} from '@tumi/legacy-app/generated/generated';
import { first, firstValueFrom, map, Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { UpdateProfileDialogComponent } from '@tumi/legacy-app/modules/profile/components/update-profile-dialog/update-profile-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClaimEventDialogComponent } from '@tumi/legacy-app/modules/profile/components/claim-event-dialog/claim-event-dialog.component';
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent implements OnDestroy {
  public profile$: Observable<UserProfileQuery['currentUser']>;
  public eventsToRate$: Observable<any[]>;
  public profileQueryRef;
  public MembershipStatus = MembershipStatus;
  constructor(
    private title: Title,
    private profileQuery: UserProfileGQL,
    private submitEventFeedbackGQL: SubmitEventFeedbackGQL,
    private updateProfileMutation: UpdateProfileGQL,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.title.setTitle('TUMi - profile');
    this.profileQueryRef = this.profileQuery.watch();
    this.profileQueryRef.startPolling(30000);
    this.profile$ = this.profileQueryRef.valueChanges.pipe(
      map(({ data }) => data.currentUser)
    );
    this.eventsToRate$ = this.profile$.pipe(
      map((profile) => [
        ...(profile?.participatedEvents.filter((event) => event?.needsRating) ??
          []),
        ...(profile?.organizedEvents.filter((event) => event?.needsRating) ??
          []),
      ])
    );

    this.route.queryParamMap.pipe(first()).subscribe((queryMap) => {
      const status = queryMap.get('stripe');
      if (status === 'success') {
        this.snackBar.open('✔️ We are processing your payment method...');
      }
      if (status === 'fail') {
        this.snackBar.open('❌ The process was cancelled');
      }
      const claimCode = queryMap.get('code');
      if (claimCode) {
        this.claimEvent(claimCode);
      }
    });
  }
  ngOnDestroy(): void {
    this.profileQueryRef.stopPolling();
  }

  /*async setupStripePayment() {
    const { data } = await firstValueFrom(this.getStripeSession.fetch());
    const stripe = await loadStripe(environment.stripeKey);
    if (stripe) {
      await stripe.redirectToCheckout({
        sessionId: data.getPaymentSetupSession.id,
      });
    }
  }*/

  async updateProfile() {
    const profile = await firstValueFrom(this.profile$);
    const result = await firstValueFrom(
      this.dialog
        .open(UpdateProfileDialogComponent, { data: { profile } })
        .afterClosed()
    );
    if (result && profile) {
      await firstValueFrom(
        this.updateProfileMutation.mutate({ input: result, userId: profile.id })
      );
    }
  }

  claimEvent(code?: string): void {
    this.dialog.open(ClaimEventDialogComponent, { data: { code } });
  }

  async saveRating($event: { rating: number; comment: string }, id: string) {
    await firstValueFrom(
      this.submitEventFeedbackGQL.mutate({
        id,
        rating: $event.rating,
        comment: $event.comment,
      })
    );
  }
}
