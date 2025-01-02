import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  GetTenantsForGlobalAdminGQL,
  UpdateTenantContractEndGQL,
} from '@tumi/legacy-app/generated/generated';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom, map } from 'rxjs';
import { ExtendDatePipe } from '@tumi/legacy-app/modules/shared/pipes/extended-date.pipe';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { UpdateContractDialogComponent } from '@tumi/legacy-app/modules/global-admin/tenants/update-contract-dialog/update-contract-dialog.component';

@Component({
  selector: 'app-tenants',
  imports: [RouterLink, ExtendDatePipe, CurrencyPipe, MatButtonModule],
  templateUrl: './tenants.component.html',
  styleUrl: './tenants.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantsComponent {
  private getTenantsForGlobalAdminGQL = inject(GetTenantsForGlobalAdminGQL);
  protected tenants = toSignal(
    this.getTenantsForGlobalAdminGQL
      .watch()
      .valueChanges.pipe(map((res) => res.data.tenants)),
  );
  private updateTenantContractEndGQL = inject(UpdateTenantContractEndGQL);
  private dialog = inject(MatDialog);

  async updateContract(tenant: {
    id: string;
    name: string;
    contractEnd: string;
    hardContractEnd: boolean;
  }) {
    const update = await firstValueFrom(
      this.dialog
        .open(UpdateContractDialogComponent, { data: tenant })
        .afterClosed(),
    );
    if (!update) return;
    await firstValueFrom(this.updateTenantContractEndGQL.mutate(update));
  }
}
