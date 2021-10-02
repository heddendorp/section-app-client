import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  GetTenantForEditGQL,
  GetTenantForEditQuery,
  UpdateTenantGQL,
} from '@tumi/data-access';
import { first, map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'tumi-tenant-edit-page',
  templateUrl: './tenant-edit-page.component.html',
  styleUrls: ['./tenant-edit-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantEditPageComponent implements OnInit {
  public editForm: FormGroup;
  public tenant$: Observable<GetTenantForEditQuery['currentTenant']>;
  constructor(
    private fb: FormBuilder,
    private updateTenant: UpdateTenantGQL,
    private loadTenant: GetTenantForEditGQL
  ) {
    this.editForm = this.fb.group({
      imprintPage: ['', Validators.required],
      privacyPolicyPage: ['', Validators.required],
      aboutPage: ['', Validators.required],
      faqPage: [''],
    });
    this.tenant$ = this.loadTenant.fetch().pipe(
      map(({ data }) => data.currentTenant),
      shareReplay(1)
    );
    this.tenant$
      .pipe(first())
      .subscribe((tenant) => this.editForm.patchValue(tenant ?? {}));
  }

  ngOnInit(): void {}

  async saveTenant() {
    const tenant = await this.tenant$.pipe(first()).toPromise();
    const formValue = this.editForm.value;
    if (tenant) {
      await this.updateTenant
        .mutate({
          id: tenant.id,
          update: { ...formValue, faqPage: formValue.faqPage || null },
        })
        .toPromise();
    } else {
      console.warn('no tenant', tenant);
    }
  }
}
