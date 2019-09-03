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
import { TumiEvent } from '../../../../shared/services/event.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

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
  iconUrl$: Observable<string>;

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      start: [null, Validators.required],
      startTime: ['', Validators.pattern('^([01]\\d|2[0-3]):([0-5]\\d)$')],
      end: [null, Validators.required],
      endTime: ['', Validators.pattern('^([01]\\d|2[0-3]):([0-5]\\d)$')],
      description: ['', Validators.required],
      participantSpots: [0, Validators.required],
      tutorSpots: [0, Validators.required],
      hasOnlineSignup: [false, Validators.required],
      hasFee: [false, Validators.required],
      public: [false, Validators.required],
      external: [false, Validators.required],
      trackTickets: [false, Validators.required],
      price: [0, Validators.required],
      fullCost: [0, Validators.required],
      signupLink: [{ value: '', disabled: true }, Validators.required],
      icon: ['']
    });
    this.iconUrl$ = this.eventForm.get('icon').valueChanges.pipe(
      debounceTime(200),
      map(icon => `https://png.icons8.com/color/${icon}/62`)
    );
    this.eventForm.get('external').valueChanges.subscribe(value => {
      if (value) {
        this.eventForm.get('hasOnlineSignup').disable();
        this.eventForm.get('hasFee').disable();
        this.eventForm.get('participantSpots').disable();
        this.eventForm.get('tutorSpots').disable();
        this.eventForm.get('price').disable();
        this.eventForm.get('fullCost').disable();
        this.eventForm.get('trackTickets').disable();
        this.eventForm.get('signupLink').enable();
      } else {
        this.eventForm.get('hasOnlineSignup').enable();
        this.eventForm.get('hasFee').enable();
        this.eventForm.get('participantSpots').enable();
        this.eventForm.get('tutorSpots').enable();
        this.eventForm.get('price').enable();
        this.eventForm.get('fullCost').enable();
        this.eventForm.get('trackTickets').enable();
        this.eventForm.get('signupLink').disable();
      }
    });
    this.eventForm.get('hasOnlineSignup').valueChanges.subscribe(value => {
      if (value) {
        this.eventForm.get('trackTickets').setValue(false);
      }
    });
    this.eventForm.get('trackTickets').valueChanges.subscribe(value => {
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
      this.eventForm.reset({
        ...event,
        startTime,
        endTime
      });
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
      name: value.name,
      description: value.description,
      start: value.start,
      end: value.end,
      participantSpots: value.participantSpots || 0,
      tutorSpots: value.tutorSpots || 0,
      hasOnlineSignup: value.hasOnlineSignup || false,
      hasFee: value.hasFee || false,
      external: value.external,
      signupLink: value.signupLink || '',
      trackTickets: value.trackTickets || false,
      public: value.public,
      price: value.price || 0,
      fullCost: value.fullCost || 0,
      icon: value.icon
    };
    this.save.emit({ ...this.event, ...formData });
  }

  ngOnDestroy(): void {
    this.destroyed$.complete();
  }
}
