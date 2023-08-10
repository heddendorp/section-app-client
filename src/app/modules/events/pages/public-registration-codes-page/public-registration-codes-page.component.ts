import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  LoadPublicRegistrationCodesGQL,
  LoadPublicRegistrationCodesQuery,
} from '@tumi/legacy-app/generated/generated';
import { IconURLPipe } from '@tumi/legacy-app/modules/shared/pipes/icon-url.pipe';
import { ExtendDatePipe } from '@tumi/legacy-app/modules/shared/pipes/extended-date.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { GridComponent } from '../../../shared/components/grid/grid.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  NgIf,
  NgFor,
  AsyncPipe,
  DatePipe,
  NgOptimizedImage,
} from '@angular/common';

@Component({
  selector: 'app-public-registration-codes-page',
  templateUrl: './public-registration-codes-page.component.html',
  styleUrls: ['./public-registration-codes-page.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatProgressBarModule,
    MatDialogModule,
    GridComponent,
    NgFor,
    MatRippleModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    AsyncPipe,
    DatePipe,
    ExtendDatePipe,
    IconURLPipe,
    NgOptimizedImage,
  ],
})
export class PublicRegistrationCodesPageComponent {
  registrationCodes$: Observable<
    LoadPublicRegistrationCodesQuery['eventRegistrationCodes']
  >;
  constructor(
    private loadPublicRegistrationCodesGQL: LoadPublicRegistrationCodesGQL,
  ) {
    this.registrationCodes$ = this.loadPublicRegistrationCodesGQL
      .watch()
      .valueChanges.pipe(map((result) => result.data.eventRegistrationCodes));
  }
}
