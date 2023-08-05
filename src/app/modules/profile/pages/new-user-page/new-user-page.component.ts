import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  EnrolmentStatus,
  GetCurrentUserGQL,
  RegisterUserGQL,
} from '@tumi/legacy-app/generated/generated';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-new-user-page',
    templateUrl: './new-user-page.component.html',
    styleUrls: ['./new-user-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatDatepickerModule,
        MatButtonModule,
    ],
})
export class NewUserPageComponent implements OnInit {
  public welcomeForm: UntypedFormGroup;
  public EnrolmentStatus = EnrolmentStatus;
  startDate = DateTime.local().minus({ years: 20 }).toJSDate();

  constructor(
    private registerUser: RegisterUserGQL,
    private fb: UntypedFormBuilder,
    private currentUser: GetCurrentUserGQL,
    private router: Router
  ) {
    this.welcomeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      university: ['', Validators.required],
      enrolmentStatus: ['', Validators.required],
      birthdate: [null, Validators.required],
      phone: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^\s*[+]\s*([0-9]\s*)+$/),
        ]),
      ], // Allow spaces in validation, strip them server-side
    });
  }

  ngOnInit(): void {
    this.welcomeForm.get('email')?.disable();
    this.currentUser.fetch().subscribe(({ data }) => {
      if (data.currentUser && data.currentUser.profileComplete) {
        // this.router.navigate(['/', 'profile']);
      }
      console.log(data.currentUser);
      this.welcomeForm.patchValue(data.currentUser ?? {});
    });
  }

  public onSubmit(): void {
    if (this.welcomeForm.invalid) return;
    this.registerUser
      .mutate({ userInput: this.welcomeForm.value })
      .subscribe(() => this.router.navigate(['/', 'profile']));
  }
}
