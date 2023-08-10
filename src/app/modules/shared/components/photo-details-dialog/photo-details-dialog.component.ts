import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PhotoShare } from '@tumi/legacy-app/generated/generated';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf, AsyncPipe, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-photo-details-dialog',
  templateUrl: './photo-details-dialog.component.html',
  styleUrls: ['./photo-details-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    NgOptimizedImage,
  ],
})
export class PhotoDetailsDialogComponent {
  public imageLoaded$ = new BehaviorSubject(false);
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { photo: PhotoShare },
    private http: HttpClient,
  ) {}

  get canShareImage() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return !!navigator.canShare;
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
      title: this.data.photo.event.title,
    });
  }

  imageLoad($event: Event): void {
    this.imageLoaded$.next(true);
  }
}
