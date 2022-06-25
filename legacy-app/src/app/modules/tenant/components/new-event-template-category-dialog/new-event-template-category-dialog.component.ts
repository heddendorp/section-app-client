import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-event-template-category-dialog',
  templateUrl: './new-event-template-category-dialog.component.html',
  styleUrls: ['./new-event-template-category-dialog.component.scss'],
})
export class NewEventTemplateCategoryDialogComponent {
  public eventTemplateCategoryForm = new FormGroup({
    name: new FormControl('', Validators.required),
    icon: new FormControl('', Validators.required),
  });

  constructor(
    private dialog: MatDialogRef<NewEventTemplateCategoryDialogComponent>
  ) {}

  onSubmit(): void {
    if (this.eventTemplateCategoryForm.valid) {
      this.dialog.close(this.eventTemplateCategoryForm.value);
    }
  }
}
