import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { GetPhotoJourneyGQL, GetPhotoJourneyQuery } from '@tumi/data-access';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tumi-photo-journey-page',
  templateUrl: './photo-journey-page.component.html',
  styleUrls: ['./photo-journey-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoJourneyPageComponent {
  $data: Observable<GetPhotoJourneyQuery['currentUser']>;
  constructor(private photoQuery: GetPhotoJourneyGQL) {
    this.$data = this.photoQuery
      .fetch()
      .pipe(map(({ data }) => data.currentUser));
  }

  openPhoto(photo: {
    __typename?: 'PhotoShare';
    id: string;
    type: string;
    src: string;
    original: string;
    originalBlob: string;
    container: string;
  }): void  {}
}
