import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { IconToastComponent } from '../../shared/components/icon-toast/icon-toast.component';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-mail-signin',
  templateUrl: './mail-signin.component.html',
  styleUrls: ['./mail-signin.component.scss']
})
export class MailSigninComponent implements OnInit {
  loginForm: FormGroup;
  error = new BehaviorSubject('');

  constructor(
    fb: FormBuilder,
    private dialog: MatDialogRef<MailSigninComponent>,
    private authService: AuthService,
    private snack: MatSnackBar
  ) {
    this.loginForm = fb.group({
      email: fb.control('', [Validators.required, Validators.email]),
      password: fb.control('', [Validators.required, Validators.minLength(6)])
    });
  }

  ngOnInit() {}

  async signup() {
    this.loginForm.disable();
    const { email, password } = this.loginForm.value;
    try {
      await this.authService.createUser(email, password);
      this.snack.openFromComponent(IconToastComponent, {
        data: {
          message: 'Account created, please check your mail!',
          icon: 'check-mail'
        }
      });
      this.dialog.close();
    } catch (e) {
      switch (e.code) {
        case 'auth/email-already-in-use': {
          let options: string[];
          try {
            options = await this.authService.getLoginOptions(email);
          } catch (e) {
            console.log(e);
          }
          if (options) {
            this.error.next(`This email is already in use, associated logins are: ${options.join(', ')}.`);
          } else {
            this.error.next('This email is already in use!');
          }
          break;
        }
        case 'auth/invalid-email': {
          this.error.next('Please enter a valid mail address!');
          break;
        }
        case 'auth/operation-not-allowed': {
          this.error.next('This operation is not allowed, please contact TUMi if this problem persists.');
          break;
        }
        case 'auth/weak-password': {
          this.error.next('The password you entered is not strong enough');
          break;
        }
      }
    }
    this.loginForm.enable();
  }

  async signin() {
    this.loginForm.disable();
    const { email, password } = this.loginForm.value;
    try {
      await this.authService.emailLogin(email, password);
      this.snack.openFromComponent(IconToastComponent, {
        data: {
          message: 'Login successful',
          icon: 'check'
        }
      });
      this.dialog.close();
    } catch (e) {
      switch (e.code) {
        case 'auth/invalid-email': {
          this.error.next('Please enter a valid mail address!');
          break;
        }
        case 'auth/user-disabled': {
          this.error.next(
            'The user associated with this email is disabled, if you think this is a mistake, please contact TUMi.'
          );
          break;
        }
        case 'auth/user-not-found': {
          this.error.next('There was no user found for this email.');
          break;
        }
        case 'auth/wrong-password': {
          this.error.next('The password you entered does not match with our records!');
          this.loginForm.get('password').reset('');
          break;
        }
      }
    }
    this.loginForm.enable();
  }
}
