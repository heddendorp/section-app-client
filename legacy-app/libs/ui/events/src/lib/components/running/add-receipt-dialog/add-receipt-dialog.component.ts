import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  AddReceiptGQL,
  GetBlobTokenGQL,
  GetCostItemQuery,
} from '@tumi/data-access';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, firstValueFrom, Subject } from 'rxjs';
import { BlobServiceClient } from '@azure/storage-blob';

@Component({
  selector: 'tumi-add-receipt-dialog',
  templateUrl: './add-receipt-dialog.component.html',
  styleUrls: ['./add-receipt-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddReceiptDialogComponent {
  public uploadForm: FormGroup;
  public previewURL$ = new Subject();
  public processing$ = new BehaviorSubject(false);
  public uploadProgress$ = new BehaviorSubject(0);
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { costItem: GetCostItemQuery['costItem'] },
    private getBlobTokenGQL: GetBlobTokenGQL,
    private addReceiptGQL: AddReceiptGQL,
    private dialog: MatDialogRef<AddReceiptDialogComponent>,
    private fb: FormBuilder
  ) {
    this.uploadForm = this.fb.group({
      file: [null, Validators.required],
      amount: ['', Validators.required],
    });
  }

  // Image Preview
  showPreview(event: Event): void  {
    const target = event.target as HTMLInputElement;
    if (target && target.files) {
      const file = target.files[0];
      this.uploadForm.patchValue({
        file: file,
      });
      this.uploadForm.get('file')?.updateValueAndValidity();

      // File Preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewURL$.next(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async save() {
    this.processing$.next(true);
    const { data } = await firstValueFrom(this.getBlobTokenGQL.fetch());
    const file = this.uploadForm.get('file')?.value;
    const amount = this.uploadForm.get('amount')?.value;
    if (data && file && amount) {
      const blobServiceClient = new BlobServiceClient(data.blobUploadKey);
      const container =
        this.data.costItem.event.id + '|' + this.data.costItem.event.title;
      const blob =
        this.randomId() + '|' + this.data.costItem.name + '|' + file.name;
      const containerClient = blobServiceClient.getContainerClient(container);
      const blockBlobClient = containerClient.getBlockBlobClient(blob);
      const res = await blockBlobClient.uploadBrowserData(
        this.uploadForm.value.file,
        {
          onProgress: (event) =>
            this.uploadProgress$.next((event.loadedBytes / file.size) * 100),
        }
      );
      await this.addReceiptGQL
        .mutate({
          costItemId: this.data.costItem.id,
          receiptInput: {
            amount,
            blob,
            container,
            type: file.type,
            md5: res.contentMD5?.toString(),
          },
        })
        .toPromise();
      this.dialog.close();
    }
    this.processing$.next(false);
  }
  private randomId(): string {
    const uint32 = crypto.getRandomValues(new Uint32Array(1))[0];
    return uint32.toString(16);
  }
}
