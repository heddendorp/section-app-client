import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import {
  CreatePhotoShareGQL,
  GetPhotoShareKeyGQL,
  GetPhotosOfEventGQL,
  GetPhotosOfEventQuery,
} from '@tumi/data-access';
import { BehaviorSubject, firstValueFrom, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { BlobServiceClient } from '@azure/storage-blob';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PhotoDetailsDialogComponent } from '@tumi/util-components';

@Component({
  selector: 'tumi-event-photo-page',
  templateUrl: './event-photo-page.component.html',
  styleUrls: ['./event-photo-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventPhotoPageComponent implements OnDestroy {
  public photos$: Observable<GetPhotosOfEventQuery['photosOfEvent']>;
  public event$: Observable<GetPhotosOfEventQuery['event']>;
  public uploadProgress$ = new BehaviorSubject(0);
  private loadPhotosRef;
  private destroyed$ = new Subject();
  constructor(
    private loadPhotos: GetPhotosOfEventGQL,
    private getShareKey: GetPhotoShareKeyGQL,
    private createPhotoShare: CreatePhotoShareGQL,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.loadPhotosRef = this.loadPhotos.watch();
    this.photos$ = this.loadPhotosRef.valueChanges.pipe(
      map(({ data }) => data.photosOfEvent)
    );
    this.event$ = this.loadPhotosRef.valueChanges.pipe(
      map(({ data }) => data.event)
    );
    this.route.paramMap
      .pipe(takeUntil(this.destroyed$))
      .subscribe((params) =>
        this.loadPhotosRef.refetch({ eventId: params.get('eventId') ?? '' })
      );
  }
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  async addFile(fileEvent: Event) {
    const target = fileEvent.target as HTMLInputElement;
    const event = await firstValueFrom(this.event$);
    if (target && target.files && event) {
      const file = target.files[0];

      // File Preview
      const reader = new FileReader();
      const image = new Image();
      reader.onload = async () => {
        image.onload = async () => {
          const ratio = image.width / image.height;
          const cols = ratio > 1.25 ? 2 : 1;
          const rows = ratio < 0.75 ? 2 : 1;
          const { data } = await firstValueFrom(this.getShareKey.fetch());
          const blobServiceClient = new BlobServiceClient(data.photoShareKey);
          const container = event.id + '|' + event.title;
          const blob = this.randomId() + '|' + file.name;
          const containerClient =
            blobServiceClient.getContainerClient(container);
          const blockBlobClient = containerClient.getBlockBlobClient(blob);
          await blockBlobClient.uploadBrowserData(file, {
            onProgress: (event) =>
              this.uploadProgress$.next((event.loadedBytes / file.size) * 100),
          });
          await firstValueFrom(
            this.createPhotoShare.mutate({
              eventId: event.id,
              data: { cols, rows, container, originalBlob: blob },
            })
          );
          this.snackbar.open('✔️ Photo uploaded');
          this.uploadProgress$.next(0);
          this.loadPhotosRef.refetch();
        };
        image.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  openPhoto(photo: unknown) {
    this.dialog.open(PhotoDetailsDialogComponent, {
      data: { photo },
      maxHeight: '95vh',
      maxWidth: '95vw',
      panelClass: 'photo-view',
    });
  }

  private randomId(): string {
    const uint32 = crypto.getRandomValues(new Uint32Array(1))[0];
    return uint32.toString(16);
  }
}
