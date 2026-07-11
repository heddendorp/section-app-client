import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  LoadAllPhotosGQL,
  LoadAllPhotosQuery,
} from '@tumi/legacy-app/generated/generated';
import { PhotoDetailsDialogComponent } from '@tumi/legacy-app/modules/shared/components/photo-details-dialog/photo-details-dialog.component';
import { firstValueFrom, map, Observable } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { ResetScrollDirective } from '../../../shared/directives/reset-scroll.directive';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveToolbarComponent } from '../../../shared/components/reactive-toolbar/reactive-toolbar.component';
import { onlyCompleteData } from 'apollo-angular';

@Component({
  selector: 'app-tenant-photos-page',
  templateUrl: './tenant-photos-page.component.html',
  styleUrls: ['./tenant-photos-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveToolbarComponent,
    MatToolbarModule,
    BackButtonComponent,
    ResetScrollDirective,
    MatProgressBarModule,
    AsyncPipe,
    NgOptimizedImage,
  ],
})
export class TenantPhotosPageComponent implements OnDestroy {
  public photos$: Observable<LoadAllPhotosQuery['photos']>;
  private photosQueryRef;

  constructor(
    private loadPhotosQuery: LoadAllPhotosGQL,
    private dialog: MatDialog,
  ) {
    this.photosQueryRef = this.loadPhotosQuery.watch();
    this.photos$ = this.photosQueryRef.valueChanges.pipe(
      onlyCompleteData(),
      map(({ data }) => data.photos),
    );
    this.photosQueryRef.startPolling(5000);
  }

  async openPhoto(photo: LoadAllPhotosQuery['photos'][number]): Promise<void> {
    const dialogRef = this.dialog.open(PhotoDetailsDialogComponent, {
      data: {
        photo,
        canDelete: true,
      },
      maxHeight: '95vh',
      maxWidth: '95vw',
      panelClass: 'photo-view',
    });

    const result = await firstValueFrom(dialogRef.afterClosed());

    if (result?.deleted) {
      await this.photosQueryRef.refetch();
    }
  }

  ngOnDestroy(): void {
    this.photosQueryRef.stopPolling();
  }
}
