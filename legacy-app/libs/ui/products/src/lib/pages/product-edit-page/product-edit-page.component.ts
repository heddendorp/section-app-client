import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  BehaviorSubject,
  firstValueFrom,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import {
  CreateProductImageGQL,
  DeleteProductImageGQL,
  GetProductImageKeyGQL,
  LoadProductGQL,
  LoadProductQuery,
  MembershipStatus,
  PublicationState,
  UpdateLeadImageGQL,
  UpdateProductGQL,
} from '@tumi/data-access';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BlobServiceClient } from '@azure/storage-blob';

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
  public uploading$ = new BehaviorSubject(false);
  private loadProductRef;
  private destroyed$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private loadProductGQL: LoadProductGQL,
    private updateProductGQL: UpdateProductGQL,
    private getProductImageKeyGQL: GetProductImageKeyGQL,
    private createProductImageGQL: CreateProductImageGQL,
    private deleteProductImageGQL: DeleteProductImageGQL,
    private updateLeadImageGQL: UpdateLeadImageGQL,
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
      needsShippingAddress: [false, Validators.required],
      isActive: [false, Validators.required],
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

  async addImage($event: Event) {
    this.uploading$.next(true);
    const target = $event.target as HTMLInputElement;
    const product = await firstValueFrom(this.product$);
    if (target && target.files && product) {
      const file = target.files[0];
      const { data } = await firstValueFrom(this.getProductImageKeyGQL.fetch());
      const blobServiceClient = new BlobServiceClient(data.productImageKey);
      const container = product.id + '|' + product.title;
      const blob = this.randomId() + '|' + file.name;
      const containerClient = blobServiceClient.getContainerClient(container);
      const blockBlobClient = containerClient.getBlockBlobClient(blob);
      await blockBlobClient.uploadBrowserData(file);
      await firstValueFrom(
        this.createProductImageGQL.mutate({
          productId: product.id,
          image: {
            type: file.type,
            originalBlob: blob,
            container,
          },
        })
      );
      this.loadProductRef.refetch();
    }
    this.uploading$.next(false);
  }

  private randomId(): string {
    const uint32 = crypto.getRandomValues(new Uint32Array(1))[0];
    return uint32.toString(16);
  }

  async makeLeadImage(id: string) {
    const product = await firstValueFrom(this.product$);
    await firstValueFrom(
      this.updateLeadImageGQL.mutate({
        productId: product.id,
        imageId: id,
      })
    );
  }

  async deleteImage(id: string) {
    await firstValueFrom(
      this.deleteProductImageGQL.mutate({
        imageId: id,
      })
    );
    this.loadProductRef.refetch();
  }

  reloadProduct() {
    this.loadProductRef.refetch();
  }
}
