import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  LoadAllPhotosGQL,
  LoadAllPhotosQuery,
} from '@tumi/legacy-app/generated/generated';
import { PhotoDetailsDialogComponent } from '@tumi/legacy-app/modules/shared/components/photo-details-dialog/photo-details-dialog.component';
import { Title } from '@angular/platform-browser';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-tenant-photos-page',
  templateUrl: './tenant-photos-page.component.html',
  styleUrls: ['./tenant-photos-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantPhotosPageComponent implements OnDestroy {
  public photos$: Observable<LoadAllPhotosQuery['photos']>;
  private photosQueryRef;

  constructor(
    private title: Title,
    private loadPhotosQuery: LoadAllPhotosGQL,
    private dialog: MatDialog
  ) {
    this.title.setTitle('TUMi - all photos');
    this.photosQueryRef = this.loadPhotosQuery.watch();
    this.photos$ = this.photosQueryRef.valueChanges.pipe(
      map(({ data }) => data.photos)
    );
    this.photosQueryRef.startPolling(5000);
  }

  openPhoto(photo: unknown): void {
    this.dialog.open(PhotoDetailsDialogComponent, {
      data: { photo },
      maxHeight: '95vh',
      maxWidth: '95vw',
      panelClass: 'photo-view',
    });
  }

  ngOnDestroy(): void {
    this.photosQueryRef.stopPolling();
  }
}
