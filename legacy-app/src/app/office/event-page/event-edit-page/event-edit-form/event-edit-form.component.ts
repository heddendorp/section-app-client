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

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TumiEvent } from '../../../../shared/services/event.service';

@Component({
  selector: 'app-event-edit-form',
  templateUrl: './event-edit-form.component.html',
  styleUrls: ['./event-edit-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventEditFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() event: TumiEvent;
  @Output() save = new EventEmitter<TumiEvent>();
  destroyed$ = new Subject();
  eventForm: FormGroup;
  icon$: Observable<string>;

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      // meetingPoint: ['', Validators.required],
      description: ['', Validators.required],
      end: [null, Validators.required],
      endTime: ['', Validators.pattern('^([01]\\d|2[0-3]):([0-5]\\d)$')],
      isExternal: [false, Validators.required],
      fullCost: [0, Validators.required],
      hasFee: [false, Validators.required],
      hasOnlineSignup: [false, Validators.required],
      icon: [''],
      isInternal: [false, Validators.required],
      name: ['', Validators.required],
      participantSpots: [0, Validators.required],
      isVisibleInternally: [false, Validators.required],
      price: [{ value: 0, disabled: true }, Validators.required],
      isVisiblePublicly: [false, Validators.required],
      runningNotes: ['', Validators.required],
      signupLink: [{ value: '', disabled: true }, Validators.required],
      start: [null, Validators.required],
      startTime: ['', Validators.pattern('^([01]\\d|2[0-3]):([0-5]\\d)$')],
      isTicketTracker: [false, Validators.required],
      tutorSpots: [0, Validators.required]
    });
    this.icon$ = this.eventForm.get('icon').valueChanges.pipe(
      debounceTime(200)
      // map(icon => `https://img.icons8.com/color/60/${icon}.svg?token=9b757a847e9a44b7d84dc1c200a3b92ecf6274b2`)
    );
    this.eventForm.get('isExternal').valueChanges.subscribe(value => {
      if (value) {
        this.disableTumi();
        this.eventForm.get('isInternal').disable({ emitEvent: false });
        this.eventForm.get('signupLink').enable();
      } else {
        this.enableTumi();
        this.eventForm.get('isInternal').enable({ emitEvent: false });
        this.eventForm.get('signupLink').disable();
      }
    });
    this.eventForm.get('isVisiblePublicly').valueChanges.subscribe(value => {
      if (value) {
        this.eventForm.get('isVisibleInternally').setValue(true, { emitEvent: false });
        this.eventForm.get('isVisibleInternally').disable({ emitEvent: false });
      } else {
        this.eventForm.get('isVisibleInternally').enable({ emitEvent: false });
      }
    });
    this.eventForm.get('isInternal').valueChanges.subscribe(value => {
      if (value) {
        this.disableTumi();
        this.eventForm.get('isExternal').disable({ emitEvent: false });
      } else {
        this.enableTumi();
        this.eventForm.get('isExternal').enable({ emitEvent: false });
      }
    });
    this.eventForm.get('hasFee').valueChanges.subscribe(value => {
      if (value) {
        this.eventForm.get('price').enable();
      } else {
        this.eventForm.get('price').disable();
      }
    });
    this.eventForm.get('hasOnlineSignup').valueChanges.subscribe(value => {
      if (value) {
        this.eventForm.get('isTicketTracker').setValue(false);
      }
    });
    this.eventForm.get('isTicketTracker').valueChanges.subscribe(value => {
      if (value) {
        this.eventForm.get('hasOnlineSignup').setValue(false);
      }
    });
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.event && !changes.event.firstChange) {
      const event = changes.event.currentValue;
      const startTime = event.start.format('HH:mm');
      const endTime = event.end.format('HH:mm');
      event.start.startOf('day');
      event.end.startOf('day');
      this.eventForm.reset(
        {
          ...event,
          startTime,
          endTime
        },
        { emitEvent: true }
      );
    }
  }

  saveChanges() {
    const value = this.eventForm.value;
    this.eventForm.disable();
    const startTime = value.startTime.split(':');
    const endTime = value.endTime.split(':');
    value.start.hours(startTime[0]).minutes(startTime[1]);
    value.end.hours(endTime[0]).minutes(endTime[1]);
    const formData = {
      description: value.description,
      end: value.end,
      isExternal: value.isExternal || false,
      fullCost: value.fullCost || 0,
      hasFee: value.hasFee || false,
      hasOnlineSignup: value.hasOnlineSignup || value.internal || false,
      icon: value.icon,
      isInternal: value.isInternal || false,
      name: value.name,
      participantSpots: value.participantSpots || 0,
      isVisibleInternally: value.isVisibleInternally || value.isVisiblePublicly,
      price: value.price || 0,
      isVisiblePublicly: value.isVisiblePublicly,
      runningNotes: value.runningNotes,
      signupLink: value.signupLink || '',
      start: value.start,
      isTicketTracker: value.isTicketTracker || false,
      tutorSpots: value.tutorSpots || 0
    };
    this.save.emit({ ...this.event, ...formData });
  }

  ngOnDestroy(): void {
    this.destroyed$.complete();
  }

  private enableTumi() {
    this.eventForm.get('fullCost').enable();
    this.eventForm.get('hasFee').enable();
    this.eventForm.get('hasOnlineSignup').enable();
    this.eventForm.get('participantSpots').enable();
    this.eventForm.get('price').enable();
    this.eventForm.get('isTicketTracker').enable();
    this.eventForm.get('tutorSpots').enable();
  }

  private disableTumi() {
    this.eventForm.get('fullCost').disable();
    this.eventForm.get('hasFee').disable();
    this.eventForm.get('hasOnlineSignup').disable();
    this.eventForm.get('participantSpots').disable();
    this.eventForm.get('price').disable();
    this.eventForm.get('isTicketTracker').disable();
    this.eventForm.get('tutorSpots').disable();
  }
}
