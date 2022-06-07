import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-organizer-dialog',
  templateUrl: './new-organizer-dialog.component.html',
  styleUrls: ['./new-organizer-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewOrganizerDialogComponent implements OnInit {
  public newOrganizerForm: UntypedFormGroup;
  constructor(
    private dialog: MatDialogRef<NewOrganizerDialogComponent>,
    private fb: UntypedFormBuilder
  ) {
    this.newOrganizerForm = this.fb.group({
      name: ['', Validators.required],
      link: [''],
      text: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.newOrganizerForm.valid) {
      this.dialog.close(this.newOrganizerForm.value);
    }
  }
}
