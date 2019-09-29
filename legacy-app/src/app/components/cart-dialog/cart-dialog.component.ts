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

import { Component, OnInit } from '@angular/core';
import { fromPromise } from 'rxjs/internal-compatibility';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '../../shared/services/auth.service';
import { CartService } from '../../shared/services/cart.service';
import { QrService } from '../../shared/services/qr.service';

@Component({
  selector: 'app-cart-dialog',
  templateUrl: './cart-dialog.component.html',
  styleUrls: ['./cart-dialog.component.scss']
})
export class CartDialogComponent implements OnInit {
  events$;
  count$;
  qrCode$;

  constructor(private cartService: CartService, private qrService: QrService, private authService: AuthService) {}

  ngOnInit() {
    this.events$ = this.cartService.savedEvents;
    this.count$ = this.cartService.eventCount;
    this.qrCode$ = this.events$.pipe(
      switchMap((events: any[]) =>
        this.authService.user.pipe(
          map(user =>
            Object.assign({
              user: user.id,
              events: events.map(val => Object.assign({ action: 'register', id: val.id }))
            })
          )
        )
      ),
      switchMap(data => fromPromise(this.qrService.getURL(data)))
    );
  }

  deleteEvent(event) {
    this.cartService.deleteEvent(event.id);
  }
}
