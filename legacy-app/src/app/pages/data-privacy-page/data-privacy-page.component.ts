import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { sendEvent } from '../../shared/utility-functions';

@Component({
  selector: 'app-data-privacy-page',
  templateUrl: './data-privacy-page.component.html',
  styleUrls: ['./data-privacy-page.component.scss']
})
export class DataPrivacyPageComponent implements OnInit, OnDestroy {
  destroyed$ = new Subject();
  optOutControl = new FormControl(JSON.parse(localStorage.getItem('disableAnalytics')) || false);
  userIdControl = new FormControl(JSON.parse(localStorage.getItem('preventUserID')) || false);

  constructor() {}

  ngOnInit() {
    this.optOutControl.valueChanges
      .pipe(
        takeUntil(this.destroyed$),
        tap(value => sendEvent('set_analytics', { event_category: 'technical', choice: value }))
      )
      .subscribe(value => localStorage.setItem('disableAnalytics', value));
    this.userIdControl.valueChanges
      .pipe(
        takeUntil(this.destroyed$),
        tap(value => sendEvent('set_user_tracking', { event_category: 'technical', choice: value }))
      )
      .subscribe(value => localStorage.setItem('preventUserID', value));
  }

  ngOnDestroy(): void {
    this.destroyed$.complete();
  }
}
