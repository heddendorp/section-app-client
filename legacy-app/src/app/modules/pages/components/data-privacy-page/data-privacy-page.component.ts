import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-data-privacy-page',
  templateUrl: './data-privacy-page.component.html',
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataPrivacyPageComponent implements OnInit, OnDestroy {
  destroyed$ = new Subject();
  optOutControl: FormControl;
  userIdControl: FormControl;
  debugModeControl: FormControl;

  constructor(@Inject(PLATFORM_ID) platformId: any) {
    if (isPlatformBrowser(platformId)) {
      this.optOutControl = new FormControl(
        JSON.parse(localStorage.getItem('disableAnalytics') ?? 'false')
      );
      this.userIdControl = new FormControl(
        JSON.parse(localStorage.getItem('preventUserID') ?? 'false')
      );
      this.debugModeControl = new FormControl(
        JSON.parse(localStorage.getItem('@@debug') ?? 'false')
      );
    } else {
      this.optOutControl = new FormControl({ value: false, disabled: true });
      this.userIdControl = new FormControl({ value: false, disabled: true });
      this.debugModeControl = new FormControl({ value: false, disabled: true });
    }
  }

  ngOnInit() {
    this.optOutControl.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((value) => localStorage.setItem('disableAnalytics', value));
    this.userIdControl.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((value) => localStorage.setItem('preventUserID', value));
    this.debugModeControl.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((value) => localStorage.setItem('@@debug', value));
  }

  ngOnDestroy(): void {
    this.destroyed$.complete();
  }
}
