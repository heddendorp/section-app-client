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

import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { combineLatest, interval, Observable, Subject } from 'rxjs';
import { map, share, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-agenda-explorer',
  templateUrl: './agenda-explorer.component.html',
  styleUrls: ['./agenda-explorer.component.scss']
})
export class AgendaExplorerComponent implements OnInit, OnDestroy {
  destroyed$ = new Subject();
  agenda: Observable<Slot[]>;
  timer: Observable<number>;
  currentItem: Observable<Slot>;
  nextItem: Observable<Slot>;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const options = { params: new HttpParams().set('key', 'AIzaSyBC3m_hlMPk3lxA_50hVNDGxjrmOkl_Cf0') };
    const fridayRequest = this.http.get<{ values: any[] }>(
      'https://content-sheets.googleapis.com/v4/spreadsheets/12xRDc2TObRaezX5uCYPufsluokLu_cwOeWGJTIXdwwE/values/Friday!1:1022',
      options
    );
    const saturdayRequest = this.http.get<{ values: any[] }>(
      'https://content-sheets.googleapis.com/v4/spreadsheets/12xRDc2TObRaezX5uCYPufsluokLu_cwOeWGJTIXdwwE/values/Saturday!1:1022',
      options
    );
    const sundayRequest = this.http.get<{ values: any[] }>(
      'https://content-sheets.googleapis.com/v4/spreadsheets/12xRDc2TObRaezX5uCYPufsluokLu_cwOeWGJTIXdwwE/values/Sunday!1:1022',
      options
    );
    this.agenda = combineLatest([fridayRequest, saturdayRequest, sundayRequest]).pipe(
      share(),
      map(requests => requests.map(request => request.values.slice(2))),
      map(days => {
        const slots = [];
        days.forEach((items, index) =>
          items.forEach(item => {
            if (item[0]) {
              slots.push({
                start: moment('24.01.2020', 'DD.MM.YYYY')
                  .add(index, 'day')
                  .hour(item[0].split(':')[0])
                  .minute(item[0].split(':')[1]),
                end: moment('24.01.2020', 'DD.MM.YYYY')
                  .add(index, 'day')
                  .hour(item[1].split(':')[0])
                  .minute(item[1].split(':')[1]),
                items: [{ topic: item[3], type: item[6], speaker: item[7], room: item[8], description: item[9] }]
              });
            } else {
              slots[slots.length - 1].items.push({
                topic: item[3],
                type: item[6],
                speaker: item[7],
                room: item[8],
                description: item[9]
              });
            }
          })
        );
        return slots;
      })
    );
    this.timer = interval(1000).pipe(takeUntil(this.destroyed$), share());
    this.nextItem = this.timer.pipe(
      switchMap(_ => this.agenda),
      map(agenda => agenda.find(slot => slot.start > moment())),
      map(slot => {
        if (!slot) {
          return null;
        }
        return Object.assign({}, slot, {
          duration: moment.duration(slot.end.diff(moment())).humanize(true)
        });
      })
    );
    this.currentItem = this.timer.pipe(
      switchMap(_ => this.agenda),
      map(agenda => agenda.find(slot => slot.start < moment() && slot.end > moment())),
      map(slot => {
        if (!slot) {
          return null;
        }
        return Object.assign({}, slot, {
          progress: Math.round((moment().diff(slot.start) / slot.end.diff(slot.start)) * 100)
        });
      })
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.complete();
  }

  trackByTopic(index, item) {
    return item.topic;
  }
}

interface Slot {
  start: moment.Moment;
  end: moment.Moment;
  progress?: number;
  duration?: string;
  items: Array<{
    topic: string;
    type: string;
    speaker: string;
    room: string;
    description: string;
  }>;
}
