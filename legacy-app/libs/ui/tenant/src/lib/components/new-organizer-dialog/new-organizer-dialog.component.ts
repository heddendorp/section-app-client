import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tumi-new-organizer-dialog',
  templateUrl: './new-organizer-dialog.component.html',
  styleUrls: ['./new-organizer-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewOrganizerDialogComponent implements OnInit {
  public newOrganizerForm: FormGroup;
  constructor(
    private dialog: MatDialogRef<NewOrganizerDialogComponent>,
    private fb: FormBuilder
  ) {
    this.newOrganizerForm = this.fb.group({
      name: ['', Validators.required],
      link: [''],
      text: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.newOrganizerForm.valid) {
      this.dialog.close(this.newOrganizerForm.value);
    }
  }
}
