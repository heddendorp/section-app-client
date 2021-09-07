import { Component, OnInit } from '@angular/core';
import { RegisterUserGQL } from '@tumi/data-access';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tumi-new-user-page',
  templateUrl: './new-user-page.component.html',
  styleUrls: ['./new-user-page.component.scss'],
})
export class NewUserPageComponent implements OnInit {
  public welcomeForm: FormGroup;
  constructor(private registerUser: RegisterUserGQL, private fb: FormBuilder) {
    this.welcomeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthdate: [null, Validators.required],
    });
  }

  ngOnInit(): void {}
}
