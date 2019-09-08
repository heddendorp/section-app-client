import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Student } from '../../services/user.service';
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

  isAdmin$: Observable<boolean>;
  isTutor$: Observable<boolean>;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { user: Student },
    private dialog: MatDialogRef<UserDataChangeComponent>,
    private authService: AuthService,
    fb: FormBuilder
  ) {
    this.userForm = fb.group({
      firstName: [data.user.firstName, Validators.required],
      lastName: [data.user.lastName, Validators.required],
      email: [data.user.academicMail, Validators.required],
      phone: [data.user.phone],
      faculty: [data.user.faculty, Validators.required],
      degree: [data.user.degree, Validators.required],
      country: [data.user.country, Validators.required],
      type: [data.user.type, Validators.required],
      isEditor: [data.user.isEditor, Validators.required],
      isTutor: [data.user.isTutor, Validators.required]
    });
    this.isTutor$ = authService.isTutor;
    this.isAdmin$ = authService.isAdmin;
  }

  submitData() {
    const values = this.userForm.value;
    const patch: Partial<Student> = {
      firstName: values.firstName,
      lastName: values.lastName,
      academicMail: values.email,
      phone: values.phone,
      faculty: values.faculty,
      degree: values.degree,
      country: values.country,
      type: values.type,
      isEditor: values.isEditor,
      isTutor: values.isTutor
    };
    this.dialog.close(Object.assign({}, { id: this.data.user.id, verified: this.data.user.verified }, patch));
  }
}
