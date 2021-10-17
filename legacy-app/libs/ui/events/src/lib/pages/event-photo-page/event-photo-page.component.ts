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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PhotoDetailsDialogComponent } from '@tumi/util-components';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { BlobServiceClient } from '@azure/storage-blob';

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
  public uploadMode$ = new BehaviorSubject<ProgressBarMode>('indeterminate');
  public uploading$ = new BehaviorSubject(false);
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
    this.uploading$.next(true);
    this.uploadMode$.next('indeterminate');
    const target = fileEvent.target as HTMLInputElement;
    const event = await firstValueFrom(this.event$);
    if (target && target.files && event) {
      const files = Array.from(target.files).filter((file) =>
        file.type.startsWith('image/')
      );
      console.log(files);
      const { data } = await firstValueFrom(this.getShareKey.fetch());
      const uploads = new BehaviorSubject(files.map(() => 0));
      uploads.subscribe((progress) => {
        const totalProgress =
          progress.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0
          ) / progress.length;
        if (totalProgress > 0) {
          this.uploadMode$.next('determinate');
          this.uploadProgress$.next(totalProgress);
        }
      });
      await Promise.all(
        files.map(async (file, index) => {
          const reader = new FileReader();
          const image = new Image();
          const imagePromise = new Promise<void>((resolve) => {
            reader.onload = () => {
              image.onload = () => resolve();
              image.src = reader.result as string;
            };
          });
          reader.readAsDataURL(file);
          await imagePromise;
          const ratio = image.width / image.height;
          const cols = ratio > 1.25 ? 2 : 1;
          const rows = ratio < 0.75 ? 2 : 1;
          const blobServiceClient = new BlobServiceClient(data.photoShareKey);
          const container = event.id + '|' + event.title;
          const blob = this.randomId() + '|' + file.name;
          const containerClient =
            blobServiceClient.getContainerClient(container);
          const blockBlobClient = containerClient.getBlockBlobClient(blob);
          await blockBlobClient.uploadBrowserData(file, {
            onProgress: (event) => {
              const newUploads = [...uploads.value];
              newUploads[index] = (event.loadedBytes / file.size) * 100;
              uploads.next(newUploads);
            },
          });
          await firstValueFrom(
            this.createPhotoShare.mutate({
              eventId: event.id,
              data: { cols, rows, container, originalBlob: blob },
            })
          );
        })
      );
      uploads.complete();
      this.snackbar.open(`✔️ ${files.length} Photos uploaded`);
      this.uploadProgress$.next(0);
      this.uploading$.next(false);
      this.loadPhotosRef.refetch();
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
