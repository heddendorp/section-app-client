import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GetCurrentUserGQL, RegisterUserGQL } from '@tumi/data-access';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DateTime } from 'luxon';

@Component({
  selector: 'tumi-new-user-page',
  templateUrl: './new-user-page.component.html',
  styleUrls: ['./new-user-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewUserPageComponent implements OnInit {
  public welcomeForm: FormGroup;
  startDate = DateTime.local().minus({ years: 20 }).toJSDate();
  constructor(
    private title: Title,
    private registerUser: RegisterUserGQL,
    private fb: FormBuilder,
    private currentUser: GetCurrentUserGQL,
    private router: Router
  ) {
    this.title.setTitle('TUMi - welcome');
    this.welcomeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      university: ['', Validators.required],
      birthdate: [null, Validators.required],
      phone: ['', Validators.pattern(/[+][0-9]+/)],
    });
  }

  ngOnInit(): void {
    this.currentUser.fetch().subscribe(({ data }) => {
      if (data.currentUser && !data.currentUser.profileComplete) {
        this.router.navigate(['/', 'profile']);
      }
    });
  }

  public onSubmit(): void {
    if (this.welcomeForm.invalid) return;
    this.registerUser
      .mutate({ userInput: this.welcomeForm.value })
      .subscribe(() => this.router.navigate(['/', 'profile']));
  }
}
