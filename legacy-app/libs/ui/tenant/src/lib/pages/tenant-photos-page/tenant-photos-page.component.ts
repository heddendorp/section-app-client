import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadAllPhotosGQL, LoadAllPhotosQuery } from '@tumi/data-access';
import { Title } from '@angular/platform-browser';
import { map } from 'rxjs/operators';
import { PhotoDetailsDialogComponent } from '@tumi/util-components';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'tumi-tenant-photos-page',
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

  openPhoto(photo: unknown) {
    this.dialog.open(PhotoDetailsDialogComponent, {
      data: { photo },
      maxHeight: '95vh',
      maxWidth: '95vw',
      panelClass: 'photo-view',
    });
  }

  ngOnDestroy() {
    this.photosQueryRef.stopPolling();
  }
}
