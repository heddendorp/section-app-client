import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilderComponent } from '@tumi/legacy-app/components/dynamicForms/form-builder/form-builder.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  LoadRegistrationDataSettingsGQL,
  UpdateRegistrationDataSettingsGQL,
} from '@tumi/legacy-app/generated/generated';
import { firstValueFrom, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-registration-data-settings-tab',
  standalone: true,
  imports: [FormBuilderComponent, MatSnackBarModule],
  templateUrl: './registration-data-settings-tab.component.html',
  styleUrl: './registration-data-settings-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationDataSettingsTabComponent {
  private snackBar = inject(MatSnackBar);
  private updateRegistrationDataSettingsGQL = inject(
    UpdateRegistrationDataSettingsGQL,
  );
  private loadRegistrationDataSettingsGQL = inject(
    LoadRegistrationDataSettingsGQL,
  );
  protected fields = toSignal(
    this.loadRegistrationDataSettingsGQL
      .watch()
      .valueChanges.pipe(
        map(({ data }) => data.currentTenant.settings.userDataCollection ?? []),
      ),
  );
  private tenantId = toSignal(
    this.loadRegistrationDataSettingsGQL
      .watch()
      .valueChanges.pipe(map(({ data }) => data.currentTenant.id)),
  );

  async saveUserDataCollection(
    fields: { type: 'text' | 'select'; label: string; options: string[] }[],
  ) {
    const tenantId = this.tenantId();
    if (!tenantId) {
      this.snackBar.open('Unable to save user data collection!', 'Dismiss', {
        duration: 5000,
      });
      return;
    }
    this.snackBar.open('Saving user data collection...', 'Dismiss', {
      duration: 0,
    });
    try {
      await firstValueFrom(
        this.updateRegistrationDataSettingsGQL.mutate({
          id: tenantId,
          input: { settings: { userDataCollection: fields } },
        }),
      );
      this.snackBar.open('User data collection saved!', 'Dismiss', {
        duration: 5000,
      });
    } catch (e) {
      if (e instanceof Error) {
        this.snackBar.open(e.message, 'Dismiss', { duration: 5000 });
      }
    }
  }
}
