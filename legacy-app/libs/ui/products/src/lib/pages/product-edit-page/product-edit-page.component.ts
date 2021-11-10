import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { firstValueFrom, Observable, Subject, takeUntil } from 'rxjs';
import {
  LoadProductGQL,
  LoadProductQuery,
  MembershipStatus,
  PublicationState,
  UpdateProductGQL,
} from '@tumi/data-access';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tumi-product-edit-page',
  templateUrl: './product-edit-page.component.html',
  styleUrls: ['./product-edit-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductEditPageComponent implements OnInit, OnDestroy {
  public MembershipStatus = MembershipStatus;
  public PublicationState = PublicationState;
  public product$: Observable<LoadProductQuery['product']>;
  public editForm: FormGroup;
  private loadProductRef;
  private destroyed$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private loadProductGQL: LoadProductGQL,
    private updateProductGQL: UpdateProductGQL,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.loadProductRef = this.loadProductGQL.watch();
    this.product$ = this.loadProductRef.valueChanges.pipe(
      map(({ data }) => data.product)
    );
    this.route.paramMap.pipe(takeUntil(this.destroyed$)).subscribe((params) => {
      this.loadProductRef.refetch({ id: params.get('productId') ?? '' });
    });
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      publicationState: ['', Validators.required],
      prices: this.fb.group({
        options: this.fb.array([], Validators.required),
      }),
      availability: [[], Validators.required],
    });
  }

  get statusOptions() {
    return Object.values(this.MembershipStatus);
  }

  get prices() {
    return this.editForm.get('prices')?.get('options') as FormArray;
  }

  addPrice() {
    this.prices.push(
      this.fb.group({
        amount: ['', Validators.required],
        esnCardRequired: [false, Validators.required],
        allowedStatusList: [this.statusOptions, Validators.required],
        defaultPrice: [false, Validators.required],
      })
    );
  }

  removePrice(index: number) {
    const priceToRemove = this.prices.at(index);
    if (priceToRemove?.get('defaultPrice')?.value) {
      return;
    }
    this.prices.removeAt(index);
  }

  async onSubmit() {
    this.snackBar.open('Saving product ⏳', undefined, { duration: 0 });
    const product = await firstValueFrom(this.product$);
    if (product && this.editForm.valid) {
      const update = this.editForm.value;
      const { data } = await firstValueFrom(
        this.updateProductGQL.mutate({
          id: product.id,
          update,
        })
      );
      if (data) {
        this.editForm.patchValue(data.updateProduct);
      }
    }
    this.snackBar.open('Product saved ✔️');
  }

  async ngOnInit() {
    const product = await firstValueFrom(this.product$);
    if (product?.prices?.options?.length) {
      for (let i = 0; i < product.prices.options.length; i++) {
        this.addPrice();
      }
    }
    if (product) {
      this.editForm.patchValue(product);
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
