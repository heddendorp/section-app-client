import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-email-login-dialog',
  templateUrl: './email-login-dialog.component.html',
  styleUrls: ['./email-login-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailLoginDialogComponent {
  public loginForm: FormGroup;
  public mailState = new BehaviorSubject('');
  public social = new BehaviorSubject('');
  public error = new BehaviorSubject('');
  constructor(
    fb: FormBuilder,
    private authService: AuthService,
    private dialog: MatDialogRef<EmailLoginDialogComponent>
  ) {
    this.loginForm = fb.group(
      {
        mail: ['', Validators.email],
        password: ['', Validators.required],
        password_confirm: ['', Validators.required],
      },
      { validator: this.passwordConfirming }
    );
    this.loginForm.get('password')?.disable();
    this.loginForm.get('password_confirm')?.disable();
  }

  private passwordConfirming(
    c: AbstractControl
  ): { confirm: boolean } | undefined {
    if (c.get('password_confirm')?.disabled) {
      return;
    }
    // @ts-ignore
    if (c.get('password').value !== c.get('password_confirm').value) {
      return { confirm: true };
    }
    return;
  }

  async getLoginOptions(): Promise<void> {
    const actions = await this.authService.fetchSignInMethodsForEmail(
      this.loginForm.get('mail')?.value
    );
    if (actions.length === 0) {
      this.mailState.next('none');
      this.loginForm.get('password')?.enable();
      this.loginForm.get('password_confirm')?.enable();
    } else if (actions.includes('password')) {
      this.mailState.next('password');
      this.loginForm.get('password')?.enable();
    } else {
      this.mailState.next('social');
      this.social.next(actions[0]);
    }
  }

  async resetPassword(): Promise<void> {
    this.mailState.next('loading');
    await this.authService.sendPasswordResetEmail(
      this.loginForm.get('mail')?.value
    );
    this.mailState.next('reset');
  }

  async login(): Promise<void> {
    this.mailState.next('loading');
    const { mail, password } = this.loginForm.value;
    let creds;
    try {
      creds = await this.authService.signInWithEmailAndPassword(mail, password);
    } catch (e) {
      console.log(e);
      this.error.next(e.message);
      this.loginForm.get('password')?.reset('');
    }
    this.mailState.next('password');
    if (creds) {
      this.dialog.close();
    }
  }

  async newAccount(): Promise<void> {
    const { mail, password } = this.loginForm.value;
    let creds;
    try {
      creds = await this.authService.createUserWithEmailAndPassword(
        mail,
        password
      );
    } catch (e) {
      console.log(e);
      this.error.next(e.message);
      this.loginForm.get('password')?.reset('');
      this.loginForm.get('password_confirm')?.reset('');
    }
    this.mailState.next('none');
    if (creds) {
      this.dialog.close();
    }
  }
}
