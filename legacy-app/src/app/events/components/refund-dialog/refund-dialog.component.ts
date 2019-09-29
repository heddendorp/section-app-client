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

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { QrService } from '../../../shared/services/qr.service';

@Component({
  selector: 'app-refund-dialog',
  templateUrl: './refund-dialog.component.html',
  styleUrls: ['./refund-dialog.component.scss']
})
export class RefundDialogComponent implements OnInit {
  qrCode;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private qrService: QrService) {}

  ngOnInit() {
    const request = {
      user: this.data.user.id,
      events: [{ id: this.data.event.id, action: 'refund' }]
    };
    console.log(JSON.stringify(request));
    this.qrService.getURL(request).then(url => (this.qrCode = url));
  }
}
