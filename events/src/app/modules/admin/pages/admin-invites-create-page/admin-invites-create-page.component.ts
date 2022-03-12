import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateInvitesGQL, MembershipStatus } from '@tumi/events/graphQL';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-invites-create-page',
  templateUrl: './admin-invites-create-page.component.html',
  styleUrls: ['./admin-invites-create-page.component.scss'],
})
export class AdminInvitesCreatePageComponent {
  public inviteForm: FormGroup;
  public MembershipStatus = MembershipStatus;

  constructor(
    private fb: FormBuilder,
    private createInvitesGQL: CreateInvitesGQL
  ) {
    this.inviteForm = this.fb.group({
      emails: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  async submitForm() {
    if (this.inviteForm.invalid) {
      return;
    }
    const value = this.inviteForm.value;
    const emails = value.emails
      .split('\n')
      .filter((email: string) => email.length > 0);
    await firstValueFrom(
      this.createInvitesGQL.mutate({ emails, status: value.status })
    );
    this.inviteForm.reset();
    alert('Invites created');
  }
}
