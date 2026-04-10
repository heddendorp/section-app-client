import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  signal,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  DeletePhotoShareGQL,
  PhotoShare,
} from '@tumi/legacy-app/generated/generated';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

type PhotoDetailsDialogPhoto = Pick<
  PhotoShare,
  'id' | 'original' | 'originalBlob' | 'type'
> & {
  event?: Pick<PhotoShare['event'], 'title'> | null;
};

type PhotoDetailsDialogData = {
  photo: PhotoDetailsDialogPhoto;
  canDelete?: boolean;
};

@Component({
  selector: 'app-photo-details-dialog',
  templateUrl: './photo-details-dialog.component.html',
  styleUrls: ['./photo-details-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    AsyncPipe,
  ],
})
export class PhotoDetailsDialogComponent {
  public imageLoaded$ = new BehaviorSubject(false);
  protected imageWidth = signal<undefined | number>(undefined);
  protected imageHeight = signal<undefined | number>(undefined);
  protected deleting = signal(false);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: PhotoDetailsDialogData,
    private http: HttpClient,
    private deletePhotoShare: DeletePhotoShareGQL,
    private dialogRef: MatDialogRef<PhotoDetailsDialogComponent>,
    private snackBar: MatSnackBar,
  ) {}

  get canShareImage() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return !!navigator.canShare;
  }

  get canDeleteImage() {
    return !!this.data.canDelete;
  }

  async shareImage() {
    const image = await firstValueFrom(
      this.http.get(this.data.photo.original, { responseType: 'blob' }),
    );
    const file = new File([image], this.data.photo.originalBlob, {
      type: this.data.photo.type,
    });
    await navigator.share({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      files: [file],
      title: this.data.photo.event?.title,
    });
  }

  async deleteImage() {
    const confirmed = confirm(
      'Delete this picture from the admin overview? This cannot be undone.',
    );

    if (!confirmed) {
      return;
    }

    this.deleting.set(true);

    try {
      await firstValueFrom(
        this.deletePhotoShare.mutate({
          id: this.data.photo.id,
        }),
      );
      this.snackBar.open('Picture deleted', 'Dismiss', {
        duration: 3000,
      });
      this.dialogRef.close({ deleted: true, id: this.data.photo.id });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Could not delete picture';
      this.snackBar.open(message, 'Dismiss', {
        duration: 5000,
      });
      this.deleting.set(false);
    }
  }

  imageLoad($event: Event): void {
    const img = $event.target as HTMLImageElement;
    const { naturalWidth, naturalHeight } = img;
    this.imageWidth.set(naturalWidth);
    this.imageHeight.set(naturalHeight);
    this.imageLoaded$.next(true);
  }
}
