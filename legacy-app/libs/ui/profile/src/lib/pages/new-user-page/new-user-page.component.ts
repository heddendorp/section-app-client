import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GetCurrentUserGQL, RegisterUserGQL } from '@tumi/data-access';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'tumi-new-user-page',
  templateUrl: './new-user-page.component.html',
  styleUrls: ['./new-user-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewUserPageComponent implements OnInit {
  public welcomeForm: FormGroup;
  constructor(
    private registerUser: RegisterUserGQL,
    private fb: FormBuilder,
    private currentUser: GetCurrentUserGQL,
    private router: Router
  ) {
    this.welcomeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthdate: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.currentUser.fetch().subscribe(({ data }) => {
      if (data) {
        this.router.navigate(['/', 'profile']);
      }
    });
  }

  public onSubmit() {
    if (this.welcomeForm.invalid) return;
    this.registerUser
      .mutate({ userInput: this.welcomeForm.value })
      .subscribe((res) => this.router.navigate(['/', 'profile']));
  }
}
