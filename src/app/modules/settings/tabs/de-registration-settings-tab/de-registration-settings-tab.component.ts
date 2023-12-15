import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  LoadDeRegistrationSettingsGQL,
  UpdateDeRegistrationSettingsGQL,
  UpdateTenantInput,
} from '@tumi/legacy-app/generated/generated';
import { firstValueFrom } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-de-registration-settings-tab',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './de-registration-settings-tab.component.html',
  styleUrl: './de-registration-settings-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeRegistrationSettingsTabComponent {
  protected freeRegistrationSettingsForm = new FormGroup({
    participants: new FormGroup({
      deRegistrationPossible: new FormControl(true, Validators.required),
      minimumDaysForDeRegistration: new FormControl(5, [
        Validators.required,
        Validators.min(0),
        Validators.pattern('^[0-9]*$'),
      ]),
      movePossible: new FormControl(true, Validators.required),
      minimumDaysForMove: new FormControl(0, [
        Validators.required,
        Validators.min(0),
        Validators.pattern('^[0-9]*$'),
      ]),
    }),
    organizers: new FormGroup({
      deRegistrationPossible: new FormControl(true, Validators.required),
      minimumDaysForDeRegistration: new FormControl(5, [
        Validators.required,
        Validators.min(0),
        Validators.pattern('^[0-9]*$'),
      ]),
    }),
  });
  protected paidRegistrationSettingsForm = new FormGroup({
    participants: new FormGroup({
      deRegistrationPossible: new FormControl(true, Validators.required),
      minimumDaysForDeRegistration: new FormControl(5, [
        Validators.required,
        Validators.min(0),
        Validators.pattern('^[0-9]*$'),
      ]),
      refundFeesOnDeRegistration: new FormControl(true, Validators.required),
      movePossible: new FormControl(true, Validators.required),
      minimumDaysForMove: new FormControl(0, [
        Validators.required,
        Validators.min(0),
        Validators.pattern('^[0-9]*$'),
      ]),
      refundFeesOnMove: new FormControl(true, Validators.required),
    }),
    organizers: new FormGroup({
      deRegistrationPossible: new FormControl(true, Validators.required),
      minimumDaysForDeRegistration: new FormControl(5, [
        Validators.required,
        Validators.min(0),
        Validators.pattern('^[0-9]*$'),
      ]),
      refundFeesOnDeRegistration: new FormControl(true, Validators.required),
    }),
  });
  private updateDeRegistrationSettingsGQL = inject(
    UpdateDeRegistrationSettingsGQL,
  );
  private snackBar = inject(MatSnackBar);
  private loadDeRegistrationSettingsGQL = inject(LoadDeRegistrationSettingsGQL);
  private deRegistrationSettings = toSignal(
    this.loadDeRegistrationSettingsGQL.watch().valueChanges,
  );

  constructor() {
    effect(() => {
      const data = this.deRegistrationSettings()?.data?.currentTenant;
      if (!data) return;
      this.freeRegistrationSettingsForm.patchValue({
        participants: {
          deRegistrationPossible:
            data.settings.deRegistrationOptions.free.participants
              .deRegistrationPossible,
          minimumDaysForDeRegistration:
            data.settings.deRegistrationOptions.free.participants
              .minimumDaysForDeRegistration,
          movePossible:
            data.settings.deRegistrationOptions.free.participants.movePossible,
          minimumDaysForMove:
            data.settings.deRegistrationOptions.free.participants
              .minimumDaysForMove,
        },
        organizers: {
          deRegistrationPossible:
            data.settings.deRegistrationOptions.free.organizers
              .deRegistrationPossible,
          minimumDaysForDeRegistration:
            data.settings.deRegistrationOptions.free.organizers
              .minimumDaysForDeRegistration,
        },
      });
      this.paidRegistrationSettingsForm.patchValue({
        participants: {
          deRegistrationPossible:
            data.settings.deRegistrationOptions.paid.participants
              .deRegistrationPossible,
          minimumDaysForDeRegistration:
            data.settings.deRegistrationOptions.paid.participants
              .minimumDaysForDeRegistration,
          refundFeesOnDeRegistration:
            data.settings.deRegistrationOptions.paid.participants
              .refundFeesOnDeRegistration,
          movePossible:
            data.settings.deRegistrationOptions.paid.participants.movePossible,
          minimumDaysForMove:
            data.settings.deRegistrationOptions.paid.participants
              .minimumDaysForMove,
          refundFeesOnMove:
            data.settings.deRegistrationOptions.paid.participants
              .refundFeesOnMove,
        },
        organizers: {
          deRegistrationPossible:
            data.settings.deRegistrationOptions.paid.organizers
              .deRegistrationPossible,
          minimumDaysForDeRegistration:
            data.settings.deRegistrationOptions.paid.organizers
              .minimumDaysForDeRegistration,
          refundFeesOnDeRegistration:
            data.settings.deRegistrationOptions.paid.organizers
              .refundFeesOnDeRegistration,
        },
      });
    });
  }

  async updateFreeEventSettings() {
    const data = this.freeRegistrationSettingsForm.value;
    if (this.freeRegistrationSettingsForm.invalid) {
      this.snackBar.open('Invalid form data', 'Dismiss', {
        duration: 3000,
      });
      return;
    }
    this.freeRegistrationSettingsForm.disable();
    this.snackBar.open('Updating free event settings...', 'Dismiss', {
      duration: 0,
    });
    await this.updatePartialSettings({
      settings: {
        deRegistrationOptions: {
          free: data,
        },
      },
    });
    this.freeRegistrationSettingsForm.enable();
  }

  async updatePaidEventSettings() {
    const data = this.paidRegistrationSettingsForm.value;
    if (this.paidRegistrationSettingsForm.invalid) {
      this.snackBar.open('Invalid form data', 'Dismiss', {
        duration: 3000,
      });
      return;
    }
    this.paidRegistrationSettingsForm.disable();
    this.snackBar.open('Updating paid event settings...', 'Dismiss', {
      duration: 0,
    });
    await this.updatePartialSettings({
      settings: {
        deRegistrationOptions: {
          paid: data,
        },
      },
    });
    this.paidRegistrationSettingsForm.enable();
  }
  private async updatePartialSettings(input: UpdateTenantInput) {
    const id = this.deRegistrationSettings()?.data?.currentTenant?.id;
    if (!id) {
      this.snackBar.open('No tenant id found', 'Dismiss', {
        duration: 3000,
      });
      throw new Error('No tenant id found');
    }
    try {
      await firstValueFrom(
        this.updateDeRegistrationSettingsGQL.mutate({ id, input }),
      );
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
