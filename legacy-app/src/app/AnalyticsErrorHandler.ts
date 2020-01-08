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

import { ErrorHandler } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';

export class AnalyticsErrorHandler implements ErrorHandler {
  constructor(private analytics: AngularFireAnalytics) {}

  handleError(error: any): void {
    const message = error.message ? error.message : error.toString();
    this.analytics.logEvent('exception', { fatal: false, description: message });
    throw error;
  }
}
