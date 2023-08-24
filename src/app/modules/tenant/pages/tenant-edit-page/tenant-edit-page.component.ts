import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Currency,
  GetTenantForEditGQL,
  GetTenantForEditQuery,
  HomePageStrategy,
  UpdateTenantGQL,
} from '@tumi/legacy-app/generated/generated';
import { first, firstValueFrom, map, Observable, shareReplay } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgFor } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ResetScrollDirective } from '../../../shared/directives/reset-scroll.directive';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveToolbarComponent } from '../../../shared/components/reactive-toolbar/reactive-toolbar.component';

@Component({
  selector: 'app-tenant-edit-page',
  templateUrl: './tenant-edit-page.component.html',
  styleUrls: ['./tenant-edit-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveToolbarComponent,
    MatToolbarModule,
    BackButtonComponent,
    ResetScrollDirective,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatCheckboxModule,
    NgFor,
    MatButtonModule,
    MatIconModule,
  ],
})
export class TenantEditPageComponent {
  public editForm: UntypedFormGroup;
  public HomePageStrategy = HomePageStrategy;
  public Currency = Currency;
  public tenant$: Observable<GetTenantForEditQuery['currentTenant']>;
  protected readonly CustomElementRegistry = CustomElementRegistry;

  get socialLinks() {
    return this.editForm.get('settings.socialLinks') as FormArray;
  }

  get sectionHubLinks() {
    return this.editForm.get('settings.sectionHubLinks') as FormArray;
  }

  addSocialLink() {
    this.socialLinks.push(
      new FormGroup({
        label: new FormControl('', Validators.required),
        url: new FormControl('', Validators.required),
        icon: new FormControl('', Validators.required),
      }),
    );
  }

  addSectionHubLink() {
    this.sectionHubLinks.push(
      new FormGroup({
        label: new FormControl('', Validators.required),
        url: new FormControl('', Validators.required),
        icon: new FormControl('', Validators.required),
      }),
    );
  }

  constructor(
    private fb: UntypedFormBuilder,
    private updateTenant: UpdateTenantGQL,
    private loadTenant: GetTenantForEditGQL,
    private snackBar: MatSnackBar,
  ) {
    this.editForm = this.fb.group({
      imprintPage: ['', Validators.required],
      privacyPolicyPage: ['', Validators.required],
      aboutPage: ['', Validators.required],
      communicationEmail: ['', Validators.required],
      faqPage: [''],
      tacPage: [''],
      homePageStrategy: ['', Validators.required],
      homePageLink: [''],
      currency: ['EUR', Validators.required],
      settings: this.fb.group({
        deRegistrationOptions: this.fb.group({
          free: this.fb.group({
            participants: this.fb.group({
              deRegistrationPossible: [true, Validators.required],
              minimumDaysForDeRegistration: [
                5,
                [
                  Validators.required,
                  Validators.min(0),
                  Validators.pattern('^[0-9]*$'),
                ],
              ],
              refundFeesOnDeRegistration: [true, Validators.required],
              movePossible: [true, Validators.required],
              minimumDaysForMove: [
                0,
                [
                  Validators.required,
                  Validators.min(0),
                  Validators.pattern('^[0-9]*$'),
                ],
              ],
              refundFeesOnMove: [true, Validators.required],
            }),
            organizers: this.fb.group({
              deRegistrationPossible: [true, Validators.required],
              minimumDaysForDeRegistration: [
                5,
                [
                  Validators.required,
                  Validators.min(0),
                  Validators.pattern('^[0-9]*$'),
                ],
              ],
              refundFeesOnDeRegistration: [true, Validators.required],
            }),
          }),
          paid: this.fb.group({
            participants: this.fb.group({
              deRegistrationPossible: [true, Validators.required],
              minimumDaysForDeRegistration: [
                5,
                [
                  Validators.required,
                  Validators.min(0),
                  Validators.pattern('^[0-9]*$'),
                ],
              ],
              refundFeesOnDeRegistration: [true, Validators.required],
              movePossible: [true, Validators.required],
              minimumDaysForMove: [
                0,
                [
                  Validators.required,
                  Validators.min(0),
                  Validators.pattern('^[0-9]*$'),
                ],
              ],
              refundFeesOnMove: [true, Validators.required],
            }),
            organizers: this.fb.group({
              deRegistrationPossible: [true, Validators.required],
              minimumDaysForDeRegistration: [
                5,
                [
                  Validators.required,
                  Validators.min(0),
                  Validators.pattern('^[0-9]*$'),
                ],
              ],
              refundFeesOnDeRegistration: [true, Validators.required],
            }),
          }),
        }),
        socialLinks: this.fb.array([]),
        sectionHubLinks: this.fb.array([]),
        showPWAInstall: [false, Validators.required],
        brandIconUrl: [''],
        esnCardLink: [''],
      }),
    });
    this.tenant$ = this.loadTenant.fetch().pipe(
      map(({ data }) => data.currentTenant),
      shareReplay(1),
    );
    this.tenant$.pipe(first()).subscribe((tenant) => {
      this.editForm.patchValue(tenant ?? {});
      if (tenant?.settings?.socialLinks) {
        tenant.settings.socialLinks.forEach((socialLink) => {
          this.addSocialLink();
          this.socialLinks.at(-1).patchValue(socialLink);
        });
      }
      if (tenant?.settings?.sectionHubLinks) {
        tenant.settings.sectionHubLinks.forEach((sectionHubLink) => {
          this.addSectionHubLink();
          this.sectionHubLinks.at(-1).patchValue(sectionHubLink);
        });
      }
    });
  }

  async saveTenant() {
    this.snackBar.open('Saving tenant ⏳', undefined, { duration: 0 });
    const tenant = await firstValueFrom(this.tenant$);
    const formValue = this.editForm.value;
    if (tenant) {
      await this.updateTenant
        .mutate({
          id: tenant.id,
          update: {
            ...formValue,
            faqPage: formValue.faqPage || null,
            tacPage: formValue.tacPage || null,
            homePageLink: formValue.homePageLink || null,
            settings: {
              ...formValue.settings,
              brandIconUrl: formValue.settings.brandIconUrl || undefined,
              esnCardLink: formValue.settings.esnCardLink || undefined,
            },
          },
        })
        .toPromise();
      this.snackBar.open('Tenant saved ✔️');
    }
  }
}
