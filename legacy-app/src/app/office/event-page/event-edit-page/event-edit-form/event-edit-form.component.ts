import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { TumiEvent } from '../../../../shared/services/event.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-event-edit-form',
  templateUrl: './event-edit-form.component.html',
  styleUrls: ['./event-edit-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventEditFormComponent implements OnInit, OnChanges {
  @Input() event: TumiEvent;
  @Output() save = new EventEmitter<TumiEvent>();
  eventForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      name: '',
      start: moment(),
      end: moment(),
      description: '',
      participantSpots: 0,
      tutorSpots: 0
    });
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.event && !changes.event.firstChange) {
      this.eventForm.reset(changes.event.currentValue);
    }
  }

  saveChanges() {
    this.eventForm.disable();
    this.save.emit({ ...this.event, ...this.eventForm.value });
  }
}
