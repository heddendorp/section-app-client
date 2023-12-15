import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import {
  LoadSiteContentSettingsGQL,
  UpdateSiteContentSettingsGQL,
} from '@tumi/legacy-app/generated/generated';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-site-content-settings-tab',
  standalone: true,
  imports: [
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './site-content-settings-tab.component.html',
  styleUrl: './site-content-settings-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteContentSettingsTabComponent {
  protected siteContentSettingsForm = new FormGroup({
    aboutPage: new FormControl(''),
    faqPage: new FormControl(''),
    tacPage: new FormControl(''),
    imprintPage: new FormControl('', Validators.required),
    privacyPolicyPage: new FormControl('', Validators.required),
  });
  private snackBar = inject(MatSnackBar);
  private updateSiteContentSettingsGQL = inject(UpdateSiteContentSettingsGQL);
  private loadSiteContentSettingsGQL = inject(LoadSiteContentSettingsGQL);
  protected siteContentSettings = toSignal(
    this.loadSiteContentSettingsGQL.watch().valueChanges,
  );

  constructor() {
    effect(() => {
      const data = this.siteContentSettings()?.data.currentTenant;
      if (!data) return;
      this.siteContentSettingsForm.patchValue(data);
    });
  }

  async updateSiteContents() {
    const data = this.siteContentSettingsForm.value;
    if (!this.siteContentSettingsForm.valid) {
      this.snackBar.open('Please fill out all required fields', 'Close', {
        duration: 5000,
      });
      return;
    }
    const tenantId = this.siteContentSettings()?.data.currentTenant.id;
    if (!tenantId) return;
    this.snackBar.open('Updating site content settings...', 'Close', {
      duration: 0,
    });

    this.siteContentSettingsForm.disable();
    try {
      await firstValueFrom(
        this.updateSiteContentSettingsGQL.mutate({ id: tenantId, input: data }),
      );
      this.snackBar.open('Site content settings updated', 'Close', {
        duration: 5000,
      });
    } catch (e) {
      if (e instanceof Error) {
        this.snackBar.open(e.message, 'Close', {
          duration: 5000,
        });
      }
    } finally {
      this.siteContentSettingsForm.enable();
    }
  }
}
