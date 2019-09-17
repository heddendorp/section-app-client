import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
declare var gtag: (...args) => void;

@Component({
  selector: 'app-data-privacy-page',
  templateUrl: './data-privacy-page.component.html',
  styleUrls: ['./data-privacy-page.component.scss']
})
export class DataPrivacyPageComponent implements OnInit, OnDestroy {
  destroyed$ = new Subject();
  optOutControl = new FormControl(localStorage.getItem('disableAnalytics') || false);

  constructor() {}

  ngOnInit() {
    this.optOutControl.valueChanges
      .pipe(
        takeUntil(this.destroyed$),
        tap(value => gtag('event', 'optOut', { value }))
      )
      .subscribe(value => localStorage.setItem('disableAnalytics', value));
  }

  ngOnDestroy(): void {
    this.destroyed$.complete();
  }
}
