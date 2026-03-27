import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  GetPhotoJourneyGQL,
  GetPhotoJourneyQuery,
  RegistrationStatus,
} from '@tumi/legacy-app/generated/generated';
import { map, Observable } from 'rxjs';
import { ExtendDatePipe } from '@tumi/legacy-app/modules/shared/pipes/extended-date.pipe';
import { AsyncPipe, DatePipe, NgOptimizedImage } from '@angular/common';
import { PhotoDetailsDialogComponent } from '@tumi/legacy-app/modules/shared/components/photo-details-dialog/photo-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-photo-journey-page',
  templateUrl: './photo-journey-page.component.html',
  styleUrls: ['./photo-journey-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, DatePipe, ExtendDatePipe, NgOptimizedImage],
})
export class PhotoJourneyPageComponent {
  $data: Observable<GetPhotoJourneyQuery['currentUser']>;
  private dialog = inject(MatDialog);
  constructor(private photoQuery: GetPhotoJourneyGQL) {
    this.$data = this.photoQuery.fetch().pipe(
      map(({ data }) => data.currentUser),
      map((user) => {
        if (user) {
          return {
            ...user,
            eventRegistrations: user?.eventRegistrations
              .filter(
                (registraion) =>
                  registraion.status !== RegistrationStatus.Cancelled,
              )
              .sort((a, b) => {
                return (
                  new Date(a.event.start).getTime() -
                  new Date(b.event.start).getTime()
                );
              }),
          };
        } else {
          return user;
        }
      }),
    );
  }

  openPhoto(photo: {
    __typename?: 'PhotoShare';
    id: string;
    type: string;
    src: string;
    original: string;
    originalBlob: string;
    container: string;
  }): void {
    this.dialog.open(PhotoDetailsDialogComponent, {
      data: { photo },
      maxHeight: '95vh',
      maxWidth: '95vw',
      panelClass: 'photo-view',
    });
  }
}
