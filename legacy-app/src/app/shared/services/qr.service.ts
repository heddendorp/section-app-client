/*
 *     The TUMi app provides a modern way of managing events for an esn section.
 *     Copyright (C) 2019  Lukas Heddendorp
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

import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import QRCode from 'qrcode';

@Injectable({
  providedIn: 'root'
})
export class QrService {
  constructor(private domSan: DomSanitizer) {}

  async getURL(data): Promise<SafeResourceUrl> {
    console.log(JSON.stringify(data));
    try {
      const url = await QRCode.toDataURL(JSON.stringify(data));
      return this.domSan.bypassSecurityTrustResourceUrl(url);
    } catch (err) {
      console.error(err);
    }
  }
}
