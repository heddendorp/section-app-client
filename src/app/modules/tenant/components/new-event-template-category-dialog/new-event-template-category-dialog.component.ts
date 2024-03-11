import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
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
export class NewEventTemplateCategoryDialogComponent implements OnInit {
  public eventTemplateCategoryForm = new FormGroup({
    name: new FormControl('', Validators.required),
    icon: new FormControl('', Validators.required),
  });
  protected data = inject(MAT_DIALOG_DATA);
  private dialog = inject(
    MatDialogRef<NewEventTemplateCategoryDialogComponent>,
  );

  ngOnInit() {
    if (this.data) {
      this.eventTemplateCategoryForm.patchValue(this.data);
    }
  }

  onSubmit(): void {
    if (this.eventTemplateCategoryForm.valid) {
      this.dialog.close(this.eventTemplateCategoryForm.value);
    }
  }
}
