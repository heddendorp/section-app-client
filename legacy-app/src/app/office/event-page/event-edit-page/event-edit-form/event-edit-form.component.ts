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
      price: { value: 0, disabled: true },
      icon: ['']
    });
    this.iconUrl$ = this.eventForm.get('icon').valueChanges.pipe(
      debounceTime(200),
      map(icon => `https://png.icons8.com/color/${icon}/62`)
    );
    this.eventForm.get('hasOnlineSignup').valueChanges.subscribe(value => {
      if (value) {
        this.eventForm.get('hasFee').setValue(false);
      }
    });
    this.eventForm.get('hasFee').valueChanges.subscribe(value => {
      if (value) {
        this.eventForm.get('hasOnlineSignup').setValue(false);
        this.eventForm.get('price').enable();
      } else {
        this.eventForm.get('price').disable();
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
      participantSpots: value.participantSpots,
      tutorSpots: value.tutorSpots,
      hasOnlineSignup: value.hasOnlineSignup,
      hasFee: value.hasFee,
      public: value.public,
      price: value.price || 0,
      icon: value.icon
    };
    this.save.emit({ ...this.event, ...formData });
  }

  ngOnDestroy(): void {
    this.destroyed$.complete();
  }
}
