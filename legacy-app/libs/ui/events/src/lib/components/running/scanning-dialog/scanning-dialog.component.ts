import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import QrScanner from 'qr-scanner';
import { BehaviorSubject } from 'rxjs';
import {
  CheckInUserGQL,
  GetRegistrationGQL,
  GetRegistrationQuery,
} from '@tumi/data-access';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tumi-scanning-dialog',
  templateUrl: './scanning-dialog.component.html',
  styleUrls: ['./scanning-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScanningDialogComponent implements AfterViewInit, OnDestroy {
  public hideScanner$ = new BehaviorSubject(false);
  public currentRegistration$ = new BehaviorSubject<
    GetRegistrationQuery['registration'] | null
  >(null);
  private scanner: QrScanner | undefined;
  @ViewChild('scannerVideo') video: ElementRef<HTMLVideoElement> | undefined;
  constructor(
    private loadRegistration: GetRegistrationGQL,
    private checkInMutation: CheckInUserGQL,
    private snackBar: MatSnackBar
  ) {}

  async ngAfterViewInit() {
    const idTest = new RegExp(
      /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    );
    QrScanner.WORKER_PATH = 'assets/qr-scanner-worker.min.js';
    if (this.video?.nativeElement) {
      this.scanner = new QrScanner(this.video?.nativeElement, (result) => {
        console.log('decoded qr code:', result);
        const isID = idTest.test(result);
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
    QrScanner.listCameras(false).then(console.log);
  }
  ngOnDestroy() {
    this.scanner?.stop();
    this.scanner?.destroy();
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
