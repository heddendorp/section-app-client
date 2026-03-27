import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  BehaviorSubject,
  firstValueFrom,
  map,
  Observable,
  shareReplay,
  Subject,
  takeUntil,
} from 'rxjs';
import {
  GetRegistrationGQL,
  GetRegistrationQuery,
  LoadEventForRunningGQL,
  LoadEventForRunningQuery,
  RegistrationStatus,
  RegistrationUsageEntry,
  TransactionDirection,
  TransactionStatus,
  UseRegistrationEntryGQL,
} from '@tumi/legacy-app/generated/generated';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import QrScanner from 'qr-scanner';
import { ExtendDatePipe } from '@tumi/legacy-app/modules/shared/pipes/extended-date.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {
  AsyncPipe,
  CurrencyPipe,
  DatePipe,
  NgOptimizedImage,
} from '@angular/common';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';

type CheckinRegistration =
  | NonNullable<GetRegistrationQuery['registration']>
  | (LoadEventForRunningQuery['event']['participantRegistrations'][0] & {
      event: LoadEventForRunningQuery['event'];
      didAttend: boolean;
    });

type CheckinFailureReason =
  | 'REGISTRATION_NOT_FOUND'
  | 'REGISTRATION_INACTIVE'
  | 'NO_ENTRIES_REMAINING'
  | 'STATE_CHANGED';

type EntryUsageState = {
  guestCheckIns: number;
  checkInTime?: string | null | Date;
};

@Component({
  selector: 'app-event-checkin-page',
  templateUrl: './event-checkin-page.component.html',
  styleUrls: ['./event-checkin-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BackButtonComponent,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    RouterLink,
    AsyncPipe,
    DatePipe,
    ExtendDatePipe,
    NgOptimizedImage,
    CurrencyPipe,
  ],
})
export class EventCheckinPageComponent implements AfterViewInit, OnDestroy {
  public hideScanner$ = new BehaviorSubject(false);
  public cameras$ = new BehaviorSubject<QrScanner.Camera[]>([]);
  public cameraControl = new UntypedFormControl();
  public currentRegistration$ = new BehaviorSubject<CheckinRegistration | null>(
    null,
  );
  public registrationLoading$ = new BehaviorSubject(false);
  public checkinInFlight$ = new BehaviorSubject(false);
  public event$: Observable<LoadEventForRunningQuery['event']>;
  public certificatePayload$ = new BehaviorSubject<{
    name: string;
    test?: {
      type: string;
      country: string;
      result: 'Positive' | 'Negative';
      hours: number;
      date: string;
      relativeDate: string;
    };
    vaccination?: {
      doseNumber: number;
      series: number;
      date: string;
      country: string;
      relativeDate: string;
    };
    recovery?: {
      date: string;
      validFrom: string;
      validUntil: string;
      country: string;
      relativeDate: string;
      relativeUntil: string;
      relativeFrom: string;
    };
  } | null>(null);
  @ViewChild('scannerVideo') video: ElementRef<HTMLVideoElement> | undefined;
  public eventId: string;
  private loadEventQueryRef;
  private destroyed$ = new Subject();
  private scanner: QrScanner | undefined;
  private scanResult$ = new Subject<string>();
  private currentEventSnapshot: LoadEventForRunningQuery['event'] | undefined;

  constructor(
    private route: ActivatedRoute,
    private loadEvent: LoadEventForRunningGQL,
    private loadRegistration: GetRegistrationGQL,
    private useRegistrationEntry: UseRegistrationEntryGQL,
    private snackBar: MatSnackBar,
  ) {
    this.loadEventQueryRef = this.loadEvent.watch({
      id: this.route.snapshot.params['eventId'],
    });
    this.eventId = this.route.snapshot.params['eventId'];
    this.event$ = this.loadEventQueryRef.valueChanges.pipe(
      map(({ data }) => data.event),
      map((event) => {
        this.currentEventSnapshot = event;
        return event;
      }),
      shareReplay(1),
    );
    this.loadEventQueryRef.startPolling(5000);
  }

  async ngAfterViewInit() {
    const idTest = new RegExp(
      /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    );
    this.scanResult$.subscribe(async (result) => {
      const isID = idTest.test(result);
      if (isID) {
        this.scanner?.stop();
        this.hideScanner$.next(true);
        this.registrationLoading$.next(true);
        const event = await firstValueFrom(this.event$);
        const registration = event.participantRegistrations.find(
          (r) => r.id === result,
        );
        if (registration) {
          this.loadRegistrationById(result, {
            ...registration,
            event,
            didAttend: registration.didAttend,
          });
        } else {
          this.loadRegistrationById(result);
        }
      }
    });
    if (this.video?.nativeElement) {
      this.scanner = new QrScanner(
        this.video?.nativeElement,
        (result) => {
          if (typeof result === 'string') {
            this.scanResult$.next(result);
          }
          this.scanResult$.next(result.data);
        },
        {
          maxScansPerSecond: 2,
          highlightScanRegion: true,
          highlightCodeOutline: true,
        },
      );
      await this.scanner.setCamera('environment');
    } else {
      this.snackBar.open('No video element found');
    }
    this.scanner?.start();
    const cameras = await QrScanner.listCameras(true);
    this.cameras$.next(cameras);
    this.cameraControl.setValue(cameras[0].id);
    this.cameraControl.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((camera) => {
        this.scanner?.setCamera(camera);
      });
  }

  getRelevantTransaction(
    transactions: {
      status: TransactionStatus;
      direction: TransactionDirection;
      amount: any;
    }[],
  ) {
    return transactions.find(
      (t) => t.direction === TransactionDirection.UserToTumi,
    );
  }

  ngOnDestroy(): void {
    this.scanner?.stop();
    this.scanner?.destroy();
    this.loadEventQueryRef.stopPolling();
    this.destroyed$.next(true);
    this.destroyed$.complete();
    this.scanResult$.complete();
  }

  showScanner(): void {
    this.hideScanner$.next(false);
    this.certificatePayload$.next(null);
  }

  public clearSelection() {
    this.currentRegistration$.next(null);
    this.hideScanner$.next(false);
    this.registrationLoading$.next(false);
  }

  public backToScanner() {
    this.currentRegistration$.next(null);
    this.hideScanner$.next(false);
    this.registrationLoading$.next(false);
    this.scanner?.start();
  }

  public hasUsageLog(
    registration: CheckinRegistration,
  ): registration is CheckinRegistration & {
    usageLog: RegistrationUsageEntry[];
  } {
    return Array.isArray((registration as any).usageLog);
  }

  private loadRegistrationById(
    registrationId: string,
    fallback?: CheckinRegistration,
  ) {
    if (fallback) {
      this.currentRegistration$.next(fallback);
    }
    this.registrationLoading$.next(true);
    // Delay avoids locking the UI thread; see original QR scan implementation.
    setTimeout(() => {
      void this.refreshRegistration(registrationId, {
        showMissingMessage: true,
        showNetworkMessage: true,
      });
    }, 100);
  }

  private async refreshRegistration(
    registrationId: string,
    options: {
      showMissingMessage?: boolean;
      showNetworkMessage?: boolean;
    } = {},
  ) {
    this.registrationLoading$.next(true);
    try {
      const { data } = await firstValueFrom(
        this.loadRegistration.fetch({ id: registrationId }),
      );
      if (data.registration) {
        this.currentRegistration$.next(data.registration);
        this.updateCachedEventRegistration(data.registration);
        return data.registration as CheckinRegistration;
      }

      this.currentRegistration$.next(null);
      if (options.showMissingMessage) {
        this.snackBar.open('Registration not found', 'OK', {
          duration: 5000,
        });
      }
      return null;
    } catch (error) {
      if (options.showNetworkMessage) {
        this.snackBar.open(
          'Could not refresh registration. Check your connection and try again.',
        );
      }
      return this.currentRegistration$.value;
    } finally {
      this.registrationLoading$.next(false);
    }
  }

  private updateCachedEventRegistration(registration: CheckinRegistration) {
    if (!this.currentEventSnapshot || !registration) {
      return;
    }
    const participantRegistrations =
      this.currentEventSnapshot.participantRegistrations.map((existing) =>
        existing.id === registration.id
          ? {
              ...existing,
              checkInTime: registration.checkInTime ?? existing.checkInTime,
              guestCheckIns: registration.guestCheckIns,
              remainingEntries: registration.remainingEntries,
              didAttend:
                'didAttend' in registration
                  ? registration.didAttend
                  : existing.didAttend,
            }
          : existing,
      );
    const participantsAttended = participantRegistrations.filter(
      (reg) => reg.didAttend || !!reg.checkInTime,
    ).length;
    this.currentEventSnapshot = {
      ...this.currentEventSnapshot,
      participantRegistrations,
      participantsAttended,
    };
  }

  private async refreshEventSnapshot() {
    try {
      const { data } = await this.loadEventQueryRef.refetch({ id: this.eventId });
      if (data?.event) {
        this.currentEventSnapshot = data.event;
      }
    } catch {
      // Polling will reconcile the event overview if this explicit refresh fails.
    }
  }

  private getUsedEntries(
    registration: EntryUsageState | null,
  ) {
    if (!registration) {
      return 0;
    }
    return registration.guestCheckIns + (registration.checkInTime ? 1 : 0);
  }

  private getCheckinFailureReason(error: unknown): CheckinFailureReason | null {
    if (!error || typeof error !== 'object' || !('graphQLErrors' in error)) {
      return null;
    }
    const graphQLErrors = error.graphQLErrors;
    if (!Array.isArray(graphQLErrors)) {
      return null;
    }

    for (const graphQLError of graphQLErrors) {
      if (!graphQLError || typeof graphQLError !== 'object') {
        continue;
      }
      const extensions =
        'extensions' in graphQLError ? graphQLError.extensions : undefined;
      if (!extensions || typeof extensions !== 'object') {
        continue;
      }
      if (
        extensions['code'] === 'CHECKIN_UNAVAILABLE' &&
        typeof extensions['reason'] === 'string'
      ) {
        return extensions['reason'] as CheckinFailureReason;
      }
    }

    return null;
  }

  private didRegistrationAdvance(
    previousRegistration: CheckinRegistration,
    refreshedRegistration: CheckinRegistration | null,
  ) {
    return (
      this.getUsedEntries(refreshedRegistration) >
      this.getUsedEntries(previousRegistration)
    );
  }

  async checkInUser() {
    const registration = this.currentRegistration$.value;
    if (!registration) {
      this.snackBar.open('⚠️ No registration loaded');
      return;
    }

    if (this.checkinInFlight$.value) {
      return;
    }

    this.checkinInFlight$.next(true);
    this.snackBar.open('Checking in...');

    try {
      const result = await firstValueFrom(
        this.useRegistrationEntry.mutate({
          registrationId: registration.id,
          manual: false,
        }),
      );

      const updatedRegistration = result.data?.useRegistrationEntry;
      if (!updatedRegistration) {
        throw new Error('Check-in did not return an updated registration');
      }

      const mergedRegistration = {
        ...registration,
        ...updatedRegistration,
      } as CheckinRegistration;
      this.currentRegistration$.next(mergedRegistration);
      this.updateCachedEventRegistration(mergedRegistration);
      await this.refreshEventSnapshot();

      const remainingEntries = updatedRegistration.remainingEntries;
      if (remainingEntries > 0) {
        this.snackBar.open(
          `✔️ Check-in successful! ${remainingEntries} entries remaining`,
        );
        return;
      }

      this.snackBar.open('✔️ All entries used - check-in complete!');
      this.currentRegistration$.next(null);
      this.hideScanner$.next(false);
      this.scanner?.start();
    } catch (error) {
      const failureReason = this.getCheckinFailureReason(error);
      const refreshedRegistration = await this.refreshRegistration(
        registration.id,
      );
      await this.refreshEventSnapshot();

      if (failureReason === 'STATE_CHANGED') {
        this.snackBar.open(
          'Another organizer already used the remaining entry. The registration has been refreshed.',
        );
      } else if (failureReason === 'NO_ENTRIES_REMAINING') {
        this.snackBar.open(
          'All entries for this registration are already used. The registration has been refreshed.',
        );
      } else if (failureReason === 'REGISTRATION_INACTIVE') {
        this.snackBar.open(
          'This registration is no longer active. The registration has been refreshed.',
        );
      } else if (failureReason === 'REGISTRATION_NOT_FOUND') {
        this.snackBar.open('Registration not found.');
      } else if (this.didRegistrationAdvance(registration, refreshedRegistration)) {
        this.snackBar.open(
          'The connection was unstable, but the registration state updated successfully.',
        );
      } else {
        this.snackBar.open(
          'Check-in failed and no change was saved. Please try again.',
        );
      }
    } finally {
      this.checkinInFlight$.next(false);
    }
  }

  protected readonly RegistrationStatus = RegistrationStatus;
}
