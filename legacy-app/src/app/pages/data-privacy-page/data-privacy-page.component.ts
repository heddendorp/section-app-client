/*
 *     The TUMi app provides a modern way of managing events for an esn section.
 *     Copyright (C) 2020  Lukas Heddendorp
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-data-privacy-page',
  templateUrl: './data-privacy-page.component.html',
  styleUrls: ['./data-privacy-page.component.scss']
})
export class DataPrivacyPageComponent implements OnInit, OnDestroy {
  destroyed$ = new Subject();
  optOutControl = new FormControl(JSON.parse(localStorage.getItem('disableAnalytics')) || false);
  userIdControl = new FormControl(JSON.parse(localStorage.getItem('preventUserID')) || false);
  debugModeControl = new FormControl(JSON.parse(localStorage.getItem('@@debug')) || false);

  constructor() {}

  ngOnInit() {
    this.optOutControl.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(value => localStorage.setItem('disableAnalytics', value));
    this.userIdControl.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(value => localStorage.setItem('preventUserID', value));
    this.debugModeControl.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(value => localStorage.setItem('@@debug', value));
  }

  ngOnDestroy(): void {
    this.destroyed$.complete();
  }
}
