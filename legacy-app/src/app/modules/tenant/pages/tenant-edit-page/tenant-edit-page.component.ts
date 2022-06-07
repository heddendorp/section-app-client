import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {
  GetTenantForEditGQL,
  GetTenantForEditQuery,
  UpdateTenantGQL,
} from '@tumi/legacy-app/generated/generated';
import { first, firstValueFrom, map, Observable, shareReplay } from 'rxjs';

@Component({
  selector: 'app-tenant-edit-page',
  templateUrl: './tenant-edit-page.component.html',
  styleUrls: ['./tenant-edit-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantEditPageComponent {
  public editForm: UntypedFormGroup;
  public tenant$: Observable<GetTenantForEditQuery['currentTenant']>;

  constructor(
    private fb: UntypedFormBuilder,
    private updateTenant: UpdateTenantGQL,
    private loadTenant: GetTenantForEditGQL
  ) {
    this.editForm = this.fb.group({
      imprintPage: ['', Validators.required],
      privacyPolicyPage: ['', Validators.required],
      aboutPage: ['', Validators.required],
      faqPage: [''],
      tacPage: [''],
    });
    this.tenant$ = this.loadTenant.fetch().pipe(
      map(({ data }) => data.currentTenant),
      shareReplay(1)
    );
    this.tenant$
      .pipe(first())
      .subscribe((tenant) => this.editForm.patchValue(tenant ?? {}));
  }

  async saveTenant() {
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
          },
        })
        .toPromise();
    } else {
    }
  }
}
