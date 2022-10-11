import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
} from '@angular/core';
import {
  GetProfileUploadKeyGQL,
  MembershipStatus,
  SubmitEventFeedbackGQL,
  UpdateProfileGQL,
  UpdateUserInformationGQL,
  UpdateUserPictureGQL,
  UserProfileEventsGQL,
  UserProfileEventsQuery,
  UserProfileGQL,
  UserProfileQuery,
} from '@tumi/legacy-app/generated/generated';
import { BehaviorSubject, first, firstValueFrom, map, Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { UpdateProfileDialogComponent } from '../../components/update-profile-dialog/update-profile-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClaimEventDialogComponent } from '../../components/claim-event-dialog/claim-event-dialog.component';
import { UpdateUserInformationDialogComponent } from '../../components/update-user-information-dialog/update-user-information-dialog.component';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { BlobServiceClient } from '@azure/storage-blob';
import { ProgressBarMode } from '@angular/material/progress-bar';
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent implements OnDestroy {
  public profile$: Observable<UserProfileQuery['currentUser']>;
  public profileEvents$: Observable<UserProfileEventsQuery['currentUser']>;
  public eventsToRate$: Observable<any[]>;
  public profileQueryRef;
  public profileEventsQueryRef;
  public MembershipStatus = MembershipStatus;
  public uploadProgress$ = new BehaviorSubject(0);
  public uploadMode$ = new BehaviorSubject<ProgressBarMode>('indeterminate');
  public uploading$ = new BehaviorSubject(false);
  constructor(
    private title: Title,
    private profileQuery: UserProfileGQL,
    private profileEventsQuery: UserProfileEventsGQL,
    private submitEventFeedbackGQL: SubmitEventFeedbackGQL,
    private updateProfileMutation: UpdateProfileGQL,
    private updateUserInformationMutation: UpdateUserInformationGQL,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public auth: AuthService,
    private getProfileUploadKeyGQL: GetProfileUploadKeyGQL,
    private updateUserPictureGQL: UpdateUserPictureGQL,
    @Inject(DOCUMENT) public document: Document
  ) {
    this.title.setTitle('Profile - TUMi');
    this.profileQueryRef = this.profileQuery.watch();
    this.profileQueryRef.startPolling(30000);
    this.profile$ = this.profileQueryRef.valueChanges.pipe(
      map(({ data }) => data.currentUser)
    );

    this.profileEventsQueryRef = this.profileEventsQuery.watch();
    this.profileEvents$ = this.profileEventsQueryRef.valueChanges.pipe(
      map(({ data }) => data.currentUser)
    );

    this.eventsToRate$ = this.profileEvents$.pipe(
      map((profile) => [
        ...(profile?.participatedEvents.filter(
          (event) => event?.ratingPending
        ) ?? []),
        ...(profile?.organizedEvents.filter((event) => event?.ratingPending) ??
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
    this.profileEventsQueryRef.stopPolling();
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
        .open(UpdateProfileDialogComponent, {
          data: { profile },
          panelClass: 'modern',
        })
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
        .open(UpdateUserInformationDialogComponent, {
          data: { profile },
          panelClass: 'modern',
        })
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
    this.dialog.open(ClaimEventDialogComponent, {
      data: { code },
      panelClass: 'modern',
    });
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

  async addFile(fileEvent: Event) {
    this.uploading$.next(true);
    this.uploadMode$.next('indeterminate');
    const target = fileEvent.target as HTMLInputElement;
    const user = await firstValueFrom(this.profile$);
    if (target && target.files && target.files.length && user) {
      const files = Array.from(target.files).filter((file) =>
        file.type.startsWith('image/')
      );
      if (!files.length) {
        this.uploadProgress$.next(0);
        this.uploading$.next(false);
        return;
      }
      const file = files[0];
      const { data } = await firstValueFrom(
        this.getProfileUploadKeyGQL.fetch()
      );
      this.uploadMode$.next('determinate');
      this.uploadProgress$.next(0);
      const reader = new FileReader();
      const image = new Image();
      const imagePromise = new Promise<void>((resolve) => {
        reader.onload = () => {
          image.onload = () => resolve();
          image.src = reader.result as string;
        };
      });
      const blobServiceClient = new BlobServiceClient(data.profileUploadKey);
      const container = user.id;
      const blob = this.randomId() + '|' + file.name;
      const containerClient = blobServiceClient.getContainerClient(container);
      const blockBlobClient = containerClient.getBlockBlobClient(blob);
      await blockBlobClient.uploadBrowserData(file, {
        blobHTTPHeaders: {
          blobContentType: file.type,
        },
        onProgress: (event) => {
          this.uploadProgress$.next((event.loadedBytes / file.size) * 100);
        },
      });
      reader.readAsDataURL(file);
      await imagePromise;
      await firstValueFrom(
        this.updateUserPictureGQL.mutate({ userId: user.id, file: blob })
      );
    }
    this.uploadProgress$.next(0);
    this.uploading$.next(false);
  }
  private randomId(): string {
    const uint32 = crypto.getRandomValues(new Uint32Array(1))[0];
    return uint32.toString(16);
  }
}
