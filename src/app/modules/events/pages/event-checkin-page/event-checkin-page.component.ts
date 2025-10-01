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
  CheckInUserGQL,
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
import { retryBackoff } from 'backoff-rxjs';
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
  | GetRegistrationQuery['registration']
  | (LoadEventForRunningQuery['event']['participantRegistrations'][0] & {
      event: LoadEventForRunningQuery['event'];
      didAttend: boolean;
    });

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
    private checkInMutation: CheckInUserGQL,
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
      this.loadRegistration
        .fetch({ id: registrationId })
        .subscribe(({ data }) => {
          this.registrationLoading$.next(false);
          if (data.registration) {
            this.currentRegistration$.next(data.registration);
            this.updateCachedEventRegistration(data.registration);
          } else {
            // Invalid registration ID (e.g., expired or wrong event)
            this.snackBar.open('Registration not found', 'OK', {
              duration: 5000,
            });
          }
        });
    }, 100);
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

  async checkInUser() {
    this.snackBar.open('Checking in...');
    const registration = this.currentRegistration$.value;
    if (registration) {
      try {
        const result = await firstValueFrom(
          this.useRegistrationEntry
            .mutate({
              registrationId: registration.id,
              manual: false, // QR scanner check-ins are not manual
            })
            .pipe(retryBackoff({ initialInterval: 100, maxRetries: 5 })),
        );

        const updatedRegistration = result.data?.useRegistrationEntry;
        if (updatedRegistration) {
          // Update the current registration with new data
          const previousRegistration = this.currentRegistration$.value;
          if (previousRegistration) {
            const mergedRegistration = {
              ...previousRegistration,
              ...updatedRegistration,
            } as CheckinRegistration;
            this.currentRegistration$.next(mergedRegistration);
            this.updateCachedEventRegistration(mergedRegistration);
          } else {
            this.currentRegistration$.next(
              updatedRegistration as unknown as CheckinRegistration,
            );
            this.updateCachedEventRegistration(
              updatedRegistration as unknown as CheckinRegistration,
            );
          }

          // Show success message with remaining entries info
          const remainingEntries = updatedRegistration.remainingEntries;
          if (remainingEntries > 0) {
            this.snackBar.open(
              `✔️ Check-in successful! ${remainingEntries} entries remaining`,
            );
          } else {
            this.snackBar.open('✔️ All entries used - check-in complete!');
            // Reset scanner for next registration
            this.currentRegistration$.next(null);
            this.hideScanner$.next(false);
            this.scanner?.start();
          }
        }
      } catch (e) {
        this.snackBar.open('Error checking in user');
      }
    } else {
      this.snackBar.open('⚠️ No registration loaded');
    }
  }

  protected readonly RegistrationStatus = RegistrationStatus;
}
