import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  LoadPublicRegistrationCodesGQL,
  LoadPublicRegistrationCodesQuery,
} from '@tumi/legacy-app/generated/generated';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-public-registration-codes-page',
  templateUrl: './public-registration-codes-page.component.html',
  styleUrls: ['./public-registration-codes-page.component.scss'],
})
export class PublicRegistrationCodesPageComponent {
  registrationCodes$: Observable<
    LoadPublicRegistrationCodesQuery['eventRegistrationCodes']
  >;
  constructor(
    private loadPublicRegistrationCodesGQL: LoadPublicRegistrationCodesGQL
  ) {
    this.registrationCodes$ = this.loadPublicRegistrationCodesGQL
      .watch()
      .valueChanges.pipe(map((result) => result.data.eventRegistrationCodes));
  }
}
