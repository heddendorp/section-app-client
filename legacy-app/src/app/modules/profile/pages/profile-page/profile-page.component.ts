import { ChangeDetectionStrategy, Component, Inject, OnDestroy } from '@angular/core';
import {
  MembershipStatus,
  SubmitEventFeedbackGQL,
  UpdateProfileGQL,
  UpdateUserInformationGQL,
  UserProfileGQL,
  UserProfileQuery,
} from '@tumi/legacy-app/generated/generated';
import { first, firstValueFrom, map, Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { UpdateProfileDialogComponent } from '../../components/update-profile-dialog/update-profile-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClaimEventDialogComponent } from '../../components/claim-event-dialog/claim-event-dialog.component';
import { UpdateUserInformationDialogComponent } from '../../components/update-user-information-dialog/update-user-information-dialog.component';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
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
    private updateUserInformationMutation: UpdateUserInformationGQL,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public auth: AuthService,
    @Inject(DOCUMENT) public document: Document
  ) {
    this.title.setTitle('TUMi - Profile');
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

  async updateUserInformation() {
    const profile = await firstValueFrom(this.profile$);
    const result = await firstValueFrom(
      this.dialog
        .open(UpdateUserInformationDialogComponent, { data: { profile } })
        .afterClosed()
    );
    if (result && profile) {
      await firstValueFrom(
        this.updateUserInformationMutation.mutate({
          input: result,
          userId: profile.id,
        })
      );
    }
  }

  claimEvent(code?: string): void {
    this.dialog.open(ClaimEventDialogComponent, { data: { code } });
  }

  async saveRating(
    $event: { rating: number; comment: string; anonymousRating: boolean },
    id: string
  ) {
    await firstValueFrom(
      this.submitEventFeedbackGQL.mutate({
        id,
        anonymousRating: $event.anonymousRating,
        rating: $event.rating,
        comment: $event.comment,
      })
    );
  }
}
