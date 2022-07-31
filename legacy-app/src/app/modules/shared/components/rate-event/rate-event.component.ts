import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-rate-event',
  templateUrl: './rate-event.component.html',
  styleUrls: ['./rate-event.component.scss'],
})
export class RateEventComponent implements OnChanges {
  @Input() event: any;
  @Input() rating = 0;
  @Input() comment = '';
  @Input() anonymousRating = false;

  @Output() ratingSubmitted = new EventEmitter<{
    rating: number;
    comment: string;
    anonymousRating: boolean;
  }>();

  public ratingForm: UntypedFormGroup;

  public isSaving = false;
  constructor(fb: UntypedFormBuilder) {
    this.ratingForm = fb.group({
      rating: [this.rating, Validators.required],
      comment: [this.comment],
      anonymousRating: [this.anonymousRating],
    });
  }

  onSubmit() {
    if (this.ratingForm.valid) {
      this.isSaving = true;
      this.ratingSubmitted.emit(this.ratingForm.value);
    }
  }

  ngOnChanges() {
    this.ratingForm.setValue({
      rating: this.rating,
      comment: this.comment,
      anonymousRating: this.anonymousRating,
    });
  }
}
