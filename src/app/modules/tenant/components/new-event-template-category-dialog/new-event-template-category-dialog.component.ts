import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { IconURLPipe } from '@tumi/legacy-app/modules/shared/pipes/icon-url.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-new-event-template-category-dialog',
  templateUrl: './new-event-template-category-dialog.component.html',
  styleUrls: ['./new-event-template-category-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    IconURLPipe,
    NgOptimizedImage,
  ],
})
export class NewEventTemplateCategoryDialogComponent {
  public eventTemplateCategoryForm = new FormGroup({
    name: new FormControl('', Validators.required),
    icon: new FormControl('', Validators.required),
  });

  constructor(
    private dialog: MatDialogRef<NewEventTemplateCategoryDialogComponent>,
  ) {}

  onSubmit(): void {
    if (this.eventTemplateCategoryForm.valid) {
      this.dialog.close(this.eventTemplateCategoryForm.value);
    }
  }
}
