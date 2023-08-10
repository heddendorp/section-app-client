import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { IconURLPipe } from '@tumi/legacy-app/modules/shared/pipes/icon-url.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RatingComponent } from '../rating/rating.component';
import { RouterLink } from '@angular/router';
import { NgIf, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-rate-event',
  templateUrl: './rate-event.component.html',
  styleUrls: ['./rate-event.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    RatingComponent,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    IconURLPipe,
    NgOptimizedImage,
  ],
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
