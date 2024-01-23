import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  CompleteProfileMutationGQL,
  EnrolmentStatus,
  LoadCompleteProfileDataGQL,
} from '@tumi/legacy-app/generated/generated';
import { Router, RouterLink } from '@angular/router';
import { DateTime } from 'luxon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormDisplayComponent } from '@tumi/legacy-app/components/dynamicForms/form-display/form-display.component';
import { AuthService } from '@auth0/auth0-angular';
import { MatCheckbox } from '@angular/material/checkbox';

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
    FormDisplayComponent,
    MatCheckbox,
    RouterLink,
  ],
})
export class NewUserPageComponent {
  public completeProfileForm = new FormGroup({
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    communicationEmail: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    birthdate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    acceptTerms: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),
    additionalData: new FormGroup({}),
  });
  public EnrolmentStatus = EnrolmentStatus;
  startDate = DateTime.local().minus({ years: 20 }).toJSDate();
  private router = inject(Router);
  private auth = inject(AuthService);
  private userData = toSignal(this.auth.user$);
  private completeProfileMutationGQL = inject(CompleteProfileMutationGQL);
  private loadCompleteProfileDataGQL = inject(LoadCompleteProfileDataGQL);
  private loadCompleteProfileData = toSignal(
    this.loadCompleteProfileDataGQL.watch().valueChanges,
  );
  protected tenantName = computed(
    () => this.loadCompleteProfileData()?.data.currentTenant.name ?? '',
  );
  protected formConfig = computed(
    () =>
      this.loadCompleteProfileData()?.data.currentTenant.settings
        .userDataCollection ?? [],
  );

  constructor() {
    effect(() => {
      const formConfig = this.formConfig();
      this.additionalDataForm.controls = {};
      if (formConfig) {
        formConfig.forEach((field) => {
          this.additionalDataForm.addControl(
            field.label,
            new FormControl('', {
              nonNullable: true,
              validators: [Validators.required],
            }),
          );
        });
      }
      const userData = this.loadCompleteProfileData()?.data.currentUser;
      const authData = this.userData();
      if (userData) {
        this.completeProfileForm.patchValue({
          firstName: userData.firstName || authData?.given_name,
          lastName: userData.lastName || authData?.family_name,
          communicationEmail:
            userData.communicationEmail || userData.email || authData?.email,
          birthdate: userData.birthdate ?? '',
          acceptTerms: userData.lastPrivacyAcceptance ? true : false,
          additionalData: userData.additionalData,
        });
      } else {
        this.completeProfileForm.patchValue({
          firstName: authData?.given_name,
          lastName: authData?.family_name,
          communicationEmail: authData?.email,
          birthdate: '',
          additionalData: {},
        });
      }
    });
  }

  get additionalDataForm(): UntypedFormGroup {
    return this.completeProfileForm.get('additionalData') as UntypedFormGroup;
  }

  public onSubmit(): void {
    if (this.completeProfileForm.invalid) return;
    this.completeProfileMutationGQL
      .mutate({ input: this.completeProfileForm.getRawValue() })
      .subscribe(() => this.router.navigate(['/', 'profile']));
  }
}
