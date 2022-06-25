import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  EnrolmentStatus,
  GetCurrentUserGQL,
  RegisterUserGQL,
} from '@tumi/legacy-app/generated/generated';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-new-user-page',
  templateUrl: './new-user-page.component.html',
  styleUrls: ['./new-user-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewUserPageComponent implements OnInit {
  public welcomeForm: UntypedFormGroup;
  public EnrolmentStatus = EnrolmentStatus;
  startDate = DateTime.local().minus({ years: 20 }).toJSDate();

  constructor(
    private title: Title,
    private registerUser: RegisterUserGQL,
    private fb: UntypedFormBuilder,
    private currentUser: GetCurrentUserGQL,
    private router: Router
  ) {
    this.title.setTitle('TUMi - welcome');
    this.welcomeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      university: ['', Validators.required],
      enrolmentStatus: ['', Validators.required],
      birthdate: [null, Validators.required],
      phone: ['', Validators.pattern(/^\s*[+]\s*([0-9]\s*)+$/)], // Allow spaces in validation, strip them server-side
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
