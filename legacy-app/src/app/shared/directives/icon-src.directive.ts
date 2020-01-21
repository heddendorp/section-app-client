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

import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appIconSrc]'
})
export class IconSrcDirective implements OnChanges {
  @Input() appIconSrc: string;

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);
    if (changes.hasOwnProperty('appIconSrc') && changes.appIconSrc.currentValue) {
      const iconString = changes.appIconSrc.currentValue;
      const [icon, style] = iconString.split(':');
      const src = `https://img.icons8.com/${style || 'color'}/192/${icon ||
        'tear-off-calendar'}.svg?token=9b757a847e9a44b7d84dc1c200a3b92ecf6274b2`;
      this.el.nativeElement.src = src;
    }
  }
}
