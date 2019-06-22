import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {
  signedUp$: Observable<boolean>;
  authenticated$: Observable<boolean>;
  authRequest$: Observable<any>;
  requestForm: FormGroup;

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.requestForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      comment: ''
    });
  }

  ngOnInit() {
    this.signedUp$ = this.authService.signedUp;
    this.authenticated$ = this.authService.authenticated;
    this.authRequest$ = this.authService.authRequest;
  }

  submitRequest() {
    this.authService.submitRequest(this.requestForm.value);
  }

  login() {
    this.authService.login();
  }
}
