import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { PhotoShare } from '@tumi/data-access';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Component({
  selector: 'tumi-photo-details-dialog',
  templateUrl: './photo-details-dialog.component.html',
  styleUrls: ['./photo-details-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoDetailsDialogComponent {
  public imageLoaded$ = new BehaviorSubject(false);
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { photo: PhotoShare },
    private http: HttpClient
  ) {}

  get canShareImage() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return !!navigator.canShare;
  }

  async shareImage() {
    const image = await firstValueFrom(
      this.http.get(this.data.photo.original, { responseType: 'blob' })
    );
    const file = new File([image], this.data.photo.originalBlob, {
      type: this.data.photo.type,
    });
    await navigator.share({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      files: [file],
      title: this.data.photo.event.title,
    });
  }

  imageLoad($event: Event) {
    this.imageLoaded$.next(true);
  }
}
