import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-update-contract-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
  ],
  templateUrl: './update-contract-dialog.component.html',
  styleUrl: './update-contract-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateContractDialogComponent {
  protected readonly tenant = inject(MAT_DIALOG_DATA) as {
    id: string;
    name: string;
    contractEnd: string;
    hardContractEnd: boolean;
  };
  protected updateForm = new FormGroup({
    id: new FormControl(this.tenant.id),
    contractEnd: new FormControl(this.tenant.contractEnd),
    hardContractEnd: new FormControl(this.tenant.hardContractEnd),
  });
}
