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
      // meetingPoint: ['', Validators.required],
      description: ['', Validators.required],
      end: [null, Validators.required],
      endTime: ['', Validators.pattern('^([01]\\d|2[0-3]):([0-5]\\d)$')],
      external: [false, Validators.required],
      fullCost: [0, Validators.required],
      hasFee: [false, Validators.required],
      hasOnlineSignup: [false, Validators.required],
      icon: [''],
      internal: [false, Validators.required],
      name: ['', Validators.required],
      participantSpots: [0, Validators.required],
      preview: [false, Validators.required],
      price: [{ value: 0, disabled: true }, Validators.required],
      public: [false, Validators.required],
      runningNotes: ['', Validators.required],
      signupLink: [{ value: '', disabled: true }, Validators.required],
      start: [null, Validators.required],
      startTime: ['', Validators.pattern('^([01]\\d|2[0-3]):([0-5]\\d)$')],
      trackTickets: [false, Validators.required],
      tutorSpots: [0, Validators.required]
    });
    this.iconUrl$ = this.eventForm.get('icon').valueChanges.pipe(
      debounceTime(200),
      map(icon => `https://png.icons8.com/color/${icon}/62`)
    );
    this.eventForm.get('external').valueChanges.subscribe(value => {
      if (value) {
        this.disableTumi();
        this.eventForm.get('internal').disable({ emitEvent: false });
        this.eventForm.get('signupLink').enable();
      } else {
        this.enableTumi();
        this.eventForm.get('internal').enable({ emitEvent: false });
        this.eventForm.get('signupLink').disable();
      }
    });
    this.eventForm.get('public').valueChanges.subscribe(value => {
      if (value) {
        this.eventForm.get('preview').setValue(true, { emitEvent: false });
        this.eventForm.get('preview').disable({ emitEvent: false });
      } else {
        this.eventForm.get('preview').enable({ emitEvent: false });
      }
    });
    this.eventForm.get('internal').valueChanges.subscribe(value => {
      if (value) {
        this.disableTumi();
        this.eventForm.get('external').disable({ emitEvent: false });
      } else {
        this.enableTumi();
        this.eventForm.get('external').enable({ emitEvent: false });
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
      description: value.description,
      end: value.end,
      external: value.external || false,
      fullCost: value.fullCost || 0,
      hasFee: value.hasFee || false,
      hasOnlineSignup: value.hasOnlineSignup || value.internal || false,
      icon: value.icon,
      internal: value.internal || false,
      name: value.name,
      participantSpots: value.participantSpots || 0,
      preview: value.preview || value.public,
      price: value.price || 0,
      public: value.public,
      runningNotes: value.runningNotes,
      signupLink: value.signupLink || '',
      start: value.start,
      trackTickets: value.trackTickets || false,
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
    this.eventForm.get('trackTickets').enable();
    this.eventForm.get('tutorSpots').enable();
  }

  private disableTumi() {
    this.eventForm.get('fullCost').disable();
    this.eventForm.get('hasFee').disable();
    this.eventForm.get('hasOnlineSignup').disable();
    this.eventForm.get('participantSpots').disable();
    this.eventForm.get('price').disable();
    this.eventForm.get('trackTickets').disable();
    this.eventForm.get('tutorSpots').disable();
  }
}
