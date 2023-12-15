import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-form-field-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './create-form-field-dialog.component.html',
  styleUrl: './create-form-field-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateFormFieldDialogComponent {
  protected fieldConfigForm = new FormGroup({
    type: new FormControl('text', Validators.required),
    label: new FormControl('', Validators.required),
    options: new FormArray([]),
  });

  get type() {
    return this.fieldConfigForm.get('type')?.value;
  }
  get options() {
    return this.fieldConfigForm.get('options') as FormArray;
  }
  protected addOption() {
    this.options.push(new FormControl('', Validators.required));
  }
}
