import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-rate-event',
  templateUrl: './rate-event.component.html',
  styleUrls: ['./rate-event.component.scss'],
})
export class RateEventComponent {
  @Input() event: any;
  @Output() ratingSubmitted = new EventEmitter<{
    rating: number;
    comment: string;
  }>();
  public ratingForm: UntypedFormGroup;
  constructor(fb: UntypedFormBuilder) {
    this.ratingForm = fb.group({
      rating: ['', Validators.required],
      comment: [''],
    });
  }

  onSubmit() {
    if (this.ratingForm.valid) {
      this.ratingSubmitted.emit(this.ratingForm.value);
    }
  }
}
