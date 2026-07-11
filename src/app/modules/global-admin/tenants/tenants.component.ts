import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  GetTenantsForGlobalAdminGQL,
  GetTenantsForGlobalAdminDocument,
  GetTenantsForGlobalAdminQuery,
  UpdateTenantContractEndGQL,
  AddTenantCreditGQL,
} from '@tumi/legacy-app/generated/generated';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom, map } from 'rxjs';
import { ExtendDatePipe } from '@tumi/legacy-app/modules/shared/pipes/extended-date.pipe';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { UpdateContractDialogComponent } from '@tumi/legacy-app/modules/global-admin/tenants/update-contract-dialog/update-contract-dialog.component';
import { AddCreditDialogComponent } from '@tumi/legacy-app/modules/global-admin/tenants/add-credit-dialog/add-credit-dialog.component';
import { onlyCompleteData } from 'apollo-angular';

@Component({
  selector: 'app-tenants',
  imports: [
    RouterLink,
    ExtendDatePipe,
    CurrencyPipe,
    DatePipe,
    MatButtonModule,
  ],
  templateUrl: './tenants.component.html',
  styleUrl: './tenants.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantsComponent {
  private getTenantsForGlobalAdminGQL = inject(GetTenantsForGlobalAdminGQL);
  protected tenants = toSignal(
    this.getTenantsForGlobalAdminGQL.watch().valueChanges.pipe(
      onlyCompleteData(),
      map((res) => res.data.tenants),
    ),
  );
  private updateTenantContractEndGQL = inject(UpdateTenantContractEndGQL);
  private addTenantCreditGQL = inject(AddTenantCreditGQL);
  private dialog = inject(MatDialog);

  protected trackByTenantId(_: number, tenant: TenantRow) {
    return tenant.id;
  }

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
    await firstValueFrom(
      this.updateTenantContractEndGQL.mutate({ variables: update }),
    );
  }

  async addCredit(tenant: TenantRow) {
    const dialogResult = await firstValueFrom(
      this.dialog
        .open(AddCreditDialogComponent, {
          data: { tenantName: tenant.name, currency: tenant.currency },
        })
        .afterClosed(),
    );
    if (!dialogResult) return;

    const creditValue = Number(dialogResult.amount);
    if (!Number.isFinite(creditValue) || creditValue <= 0) {
      return;
    }

    const creditInMinorUnits = Math.round(creditValue * 100);
    await firstValueFrom(
      this.addTenantCreditGQL.mutate({
        variables: {
          id: tenant.id,
          credit: creditInMinorUnits,
          description: dialogResult.description,
        },
        refetchQueries: [{ query: GetTenantsForGlobalAdminDocument }],
      }),
    );
  }
}

type TenantRow = GetTenantsForGlobalAdminQuery['tenants'][number];
