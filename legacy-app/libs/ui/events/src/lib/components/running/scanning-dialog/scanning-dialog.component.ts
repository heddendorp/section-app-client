import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import QrScanner from 'qr-scanner';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  CheckInUserGQL,
  GetRegistrationGQL,
  GetRegistrationQuery,
  LoadEventForRunningGQL,
  LoadEventForRunningQuery,
  VerifyCertificateGQL,
} from '@tumi/data-access';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'tumi-scanning-dialog',
  templateUrl: './scanning-dialog.component.html',
  styleUrls: ['./scanning-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScanningDialogComponent implements AfterViewInit, OnDestroy {
  public hideScanner$ = new BehaviorSubject(false);
  public cameras$ = new BehaviorSubject<QrScanner.Camera[]>([]);
  public cameraControl = new FormControl();
  public currentRegistration$ = new BehaviorSubject<
    GetRegistrationQuery['registration'] | null
  >(null);
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
  private loadEventQueryRef;
  private destroyed$ = new Subject();
  private scanner: QrScanner | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    private loadEvent: LoadEventForRunningGQL,
    private loadRegistration: GetRegistrationGQL,
    private checkInMutation: CheckInUserGQL,
    private verifyCertificateGQL: VerifyCertificateGQL,
    private snackBar: MatSnackBar
  ) {
    this.loadEventQueryRef = this.loadEvent.watch({ id: this.data.id });
    this.event$ = this.loadEventQueryRef.valueChanges.pipe(
      map(({ data }) => data.event)
    );
    this.loadEventQueryRef.startPolling(5000);
  }

  async ngAfterViewInit() {
    const idTest = new RegExp(
      /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    );
    QrScanner.WORKER_PATH = 'assets/qr-scanner-worker.min.js';
    if (this.video?.nativeElement) {
      this.scanner = new QrScanner(this.video?.nativeElement, (result) => {
        console.log('decoded qr code:', result);
        const isID = idTest.test(result);
        if (result.includes('HC1')) {
          // DCC.unpackAndVerify(result);
          this.verifyCertificateGQL
            .mutate({
              cert: result,
            })
            .subscribe({
              next: ({ data }) => {
                if (data) {
                  this.snackBar.open(
                    `Certificate scanned: ${data.verifyDCC.status}`
                  );
                  this.certificatePayload$.next(data.verifyDCC.payload);
                  this.hideScanner$.next(true);
                } else {
                  this.snackBar.open('Certificate not verified');
                }
              },
              error: (err) => {
                console.log(err);
                this.snackBar.open('Error processing certificate');
              },
            });
        }
        if (isID) {
          this.scanner?.stop();
          this.hideScanner$.next(true);
          this.loadRegistration
            .fetch({ id: result })
            .subscribe(({ data }) =>
              this.currentRegistration$.next(data.registration)
            );
        }
      });
      await this.scanner.setCamera('environment');
    } else {
      console.log('no video');
      console.log(this.video);
    }
    this.scanner?.start();
    const cameras = await QrScanner.listCameras(true);
    this.cameras$.next(cameras);
    this.cameraControl.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((camera) => {
        this.scanner?.setCamera(camera);
      });
  }

  ngOnDestroy(): void {
    this.scanner?.stop();
    this.scanner?.destroy();
    this.loadEventQueryRef.stopPolling();
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  showScanner(): void {
    this.hideScanner$.next(false);
    this.certificatePayload$.next(null);
  }

  async checkInUser() {
    const registration = this.currentRegistration$.value;
    if (registration) {
      await this.checkInMutation.mutate({ id: registration.id }).toPromise();
      this.snackBar.open('✔️ Check in successful');
      this.currentRegistration$.next(null);
      this.hideScanner$.next(false);
      this.scanner?.start();
    } else {
      this.snackBar.open('⚠️ No registration loaded');
    }
  }
}
