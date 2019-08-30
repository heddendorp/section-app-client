import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Student } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { allFaculties, allTargets, allTypes } from '../../uni-data';

@Component({
  selector: 'app-user-data-change',
  templateUrl: './user-data-change.component.html',
  styleUrls: ['./user-data-change.component.scss']
})
export class UserDataChangeComponent {
  userForm: FormGroup;
  faculties = allFaculties;
  targets = allTargets;
  studentTypes = allTypes;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: Student },
    public dialog: MatDialogRef<UserDataChangeComponent>,
    fb: FormBuilder
  ) {
    this.userForm = fb.group({
      name: [data.user.displayName, Validators.required],
      email: [data.user.academicMail, Validators.required],
      faculty: [data.user.faculty, Validators.required],
      degree: [data.user.degree, Validators.required],
      country: [data.user.country, Validators.required],
      type: [data.user.type, Validators.required]
    });
  }

  submitData() {
    const values = this.userForm.value;
    const patch: Partial<Student> = {
      displayName: values.name,
      academicMail: values.email,
      faculty: values.faculty,
      degree: values.degree,
      country: values.country,
      type: values.type
    };
    this.dialog.close(Object.assign({}, this.data.user, patch));
  }
}
