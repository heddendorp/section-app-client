/*
 *     The TUMi app provides a modern way of managing events for an esn section.
 *     Copyright (C) 2019  Lukas Heddendorp
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Student } from '../../services/user.service';
import { AuthState } from '../../state/auth.state';
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

  @Select(AuthState.isAdmin) isAdmin$: Observable<boolean>;
  @Select(AuthState.isTutor) isTutor$: Observable<boolean>;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { user: Student },
    private dialog: MatDialogRef<UserDataChangeComponent>,
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
    this.dialog.close(
      Object.assign(
        {},
        { id: this.data.user.id, verified: this.data.user.verified, email: this.data.user.email },
        patch
      )
    );
  }
}
