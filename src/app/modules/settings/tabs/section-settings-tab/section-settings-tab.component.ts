import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import {
  Currency,
  HomePageStrategy,
  LoadSectionSettingsGQL,
  MembershipStatus,
  UpdateSectionSettingsGQL,
  UpdateTenantInput,
} from '@tumi/legacy-app/generated/generated';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TitleCasePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-section-settings-tab',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    TitleCasePipe,
  ],
  templateUrl: './section-settings-tab.component.html',
  styleUrl: './section-settings-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionSettingsTabComponent {
  protected readonly Currency = Currency;
  protected readonly MembershipStatus = MembershipStatus;
  protected readonly HomePageStrategy = HomePageStrategy;
  protected generalSectionSettingsForm = new FormGroup({
    currency: new FormControl<Currency>(Currency.Eur),
    communicationEmail: new FormControl(''),
    settings: new FormGroup({
      showPWAInstall: new FormControl(false),
      brandIconUrl: new FormControl(''),
      esnCardLink: new FormControl(''),
    }),
  });
  protected homePageSectionSettingsForm = new FormGroup({
    homePageStrategy: new FormControl<HomePageStrategy>(
      HomePageStrategy.Markdown,
    ),
    homePageLink: new FormControl(''),
  });
  protected socialLinksSectionSettingsForm = new FormGroup({
    socialLinks: new FormArray<any>([]),
  });
  protected sectionHubLinksSectionSettingsForm = new FormGroup({
    sectionHubLinks: new FormArray<any>([]),
  });
  protected bannersSectionSettingsForm = new FormGroup({
    banners: new FormArray<any>([]),
  });
  private snackBar = inject(MatSnackBar);
  private updateSectionSettingsGQL = inject(UpdateSectionSettingsGQL);
  private loadSectionSettingsGQL = inject(LoadSectionSettingsGQL);
  private sectionSettings = toSignal(
    this.loadSectionSettingsGQL.watch().valueChanges,
  );

  constructor() {
    effect(() => {
      const data = this.sectionSettings()?.data?.currentTenant;
      if (!data) return;
      this.generalSectionSettingsForm.patchValue({
        currency: data.currency,
        communicationEmail: data.communicationEmail,
        settings: {
          showPWAInstall: data.settings.showPWAInstall,
          brandIconUrl: data.settings.brandIconUrl,
          esnCardLink: data.settings.esnCardLink,
        },
      });
      this.homePageSectionSettingsForm.patchValue({
        homePageStrategy: data.homePageStrategy,
        homePageLink: data.homePageLink,
      });
      data.settings.socialLinks.forEach(() => this.addSocialLink());
      this.socialLinksSectionSettingsForm.patchValue({
        socialLinks: data.settings.socialLinks,
      });
      data.settings.sectionHubLinks.forEach(() => this.addSectionHubLink());
      this.sectionHubLinksSectionSettingsForm.patchValue({
        sectionHubLinks: data.settings.sectionHubLinks,
      });
      data.settings.banners.forEach(() => this.addBanner());
      this.bannersSectionSettingsForm.patchValue({
        banners: data.settings.banners,
      });
    });
  }

  get banners(): FormArray {
    return this.bannersSectionSettingsForm.get('banners') as FormArray;
  }

  get socialLinks(): FormArray {
    return this.socialLinksSectionSettingsForm.get('socialLinks') as FormArray;
  }

  get sectionHubLinks(): FormArray {
    return this.sectionHubLinksSectionSettingsForm.get(
      'sectionHubLinks',
    ) as FormArray;
  }

  get statusOptions() {
    return Object.values(this.MembershipStatus);
  }

  async updateGeneralSettings() {
    const data = this.generalSectionSettingsForm.value;
    if (this.generalSectionSettingsForm.invalid) {
      this.snackBar.open('Invalid form data', 'Dismiss', {
        duration: 3000,
      });
      return;
    }
    this.generalSectionSettingsForm.disable();
    this.snackBar.open('Updating general settings...', 'Dismiss', {
      duration: 0,
    });
    await this.updatePartialSettings(data);
    this.generalSectionSettingsForm.enable();
  }

  async updateHomePageSettings() {
    const data = this.homePageSectionSettingsForm.value;
    if (this.homePageSectionSettingsForm.invalid) {
      this.snackBar.open('Invalid form data', 'Dismiss', {
        duration: 3000,
      });
      return;
    }
    this.homePageSectionSettingsForm.disable();
    this.snackBar.open('Updating home page settings...', 'Dismiss', {
      duration: 0,
    });
    await this.updatePartialSettings(data);
    this.homePageSectionSettingsForm.enable();
  }

  async updateAppBanners() {
    const data = this.bannersSectionSettingsForm.value;
    if (this.bannersSectionSettingsForm.invalid) {
      this.snackBar.open('Invalid form data', 'Dismiss', {
        duration: 3000,
      });
      return;
    }
    this.bannersSectionSettingsForm.disable();
    this.snackBar.open('Updating app banners...', 'Dismiss', {
      duration: 0,
    });
    await this.updatePartialSettings({ settings: data });
    this.bannersSectionSettingsForm.enable();
  }

  async updateSectionHubLinks() {
    const data = this.sectionHubLinksSectionSettingsForm.value;
    if (this.sectionHubLinksSectionSettingsForm.invalid) {
      this.snackBar.open('Invalid form data', 'Dismiss', {
        duration: 3000,
      });
      return;
    }
    this.sectionHubLinksSectionSettingsForm.disable();
    this.snackBar.open('Updating section hub links...', 'Dismiss', {
      duration: 0,
    });
    await this.updatePartialSettings({ settings: data });
    this.sectionHubLinksSectionSettingsForm.enable();
  }

  async updateSocialLinks() {
    const data = this.socialLinksSectionSettingsForm.value;
    if (this.socialLinksSectionSettingsForm.invalid) {
      this.snackBar.open('Invalid form data', 'Dismiss', {
        duration: 3000,
      });
      return;
    }
    this.socialLinksSectionSettingsForm.disable();
    this.snackBar.open('Updating social links...', 'Dismiss', {
      duration: 0,
    });
    await this.updatePartialSettings({ settings: data });
    this.socialLinksSectionSettingsForm.enable();
  }

  protected addBanner() {
    this.banners.push(
      new FormGroup({
        title: new FormControl('', Validators.required),
        body: new FormControl('', Validators.required),
        color: new FormControl('primary', Validators.required),
        link: new FormControl('', Validators.required),
        displayToMembershipStatus: new FormControl(
          [
            MembershipStatus.None,
            MembershipStatus.Selected,
            MembershipStatus.Trial,
            MembershipStatus.Full,
            MembershipStatus.Alumni,
            MembershipStatus.Sponsor,
          ],
          Validators.required,
        ),
      }),
    );
  }

  protected addSocialLink() {
    this.socialLinks.push(
      new FormGroup({
        label: new FormControl('', Validators.required),
        url: new FormControl('', Validators.required),
        icon: new FormControl('', Validators.required),
      }),
    );
  }

  protected addSectionHubLink() {
    this.sectionHubLinks.push(
      new FormGroup({
        label: new FormControl('', Validators.required),
        url: new FormControl('', Validators.required),
        icon: new FormControl('', Validators.required),
      }),
    );
  }

  private async updatePartialSettings(input: UpdateTenantInput) {
    const id = this.sectionSettings()?.data?.currentTenant?.id;
    if (!id) {
      this.snackBar.open('No tenant id found', 'Dismiss', {
        duration: 3000,
      });
      throw new Error('No tenant id found');
    }
    try {
      await firstValueFrom(this.updateSectionSettingsGQL.mutate({ id, input }));
      this.snackBar.open('Settings updated', 'Dismiss', {
        duration: 3000,
      });
    } catch (e) {
      if (e instanceof Error) {
        this.snackBar.open(e.message, 'Dismiss', {
          duration: 5000,
        });
      } else {
        this.snackBar.open('Unknown error', 'Dismiss', {
          duration: 5000,
        });
      }
    }
  }
}
