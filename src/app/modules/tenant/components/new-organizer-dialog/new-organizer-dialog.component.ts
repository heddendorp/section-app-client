import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-new-organizer-dialog',
  templateUrl: './new-organizer-dialog.component.html',
  styleUrls: ['./new-organizer-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class NewOrganizerDialogComponent implements OnInit {
  public newOrganizerForm: UntypedFormGroup;
  protected data = inject(MAT_DIALOG_DATA);
  constructor(
    private dialog: MatDialogRef<NewOrganizerDialogComponent>,
    private fb: UntypedFormBuilder,
  ) {
    this.newOrganizerForm = this.fb.group({
      name: ['', Validators.required],
      link: [''],
      text: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.newOrganizerForm.patchValue(this.data);
    }
  }

  onSubmit(): void {
    if (this.newOrganizerForm.valid) {
      this.dialog.close(this.newOrganizerForm.value);
    }
  }
}
