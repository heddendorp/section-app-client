import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadAllPhotosGQL, LoadAllPhotosQuery } from '@tumi/data-access';
import { Title } from '@angular/platform-browser';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tumi-tenant-photos-page',
  templateUrl: './tenant-photos-page.component.html',
  styleUrls: ['./tenant-photos-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantPhotosPageComponent implements OnDestroy {
  public photos$: Observable<LoadAllPhotosQuery['photos']>;
  private photosQueryRef;
  constructor(private title: Title, private loadPhotosQuery: LoadAllPhotosGQL) {
    this.title.setTitle('TUMi - manage registrations');
    this.photosQueryRef = this.loadPhotosQuery.watch();
    this.photosQueryRef.startPolling(5000);
    this.photos$ = this.photosQueryRef.valueChanges.pipe(
      map(({ data }) => data.photos)
    );
  }

  ngOnDestroy() {
    this.photosQueryRef.stopPolling();
  }
}
