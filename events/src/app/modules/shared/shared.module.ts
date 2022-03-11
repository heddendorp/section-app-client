import { Inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconUrlPipe } from './pipes/icon-url.pipe';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { LOCATION } from '@ng-web-apis/common';

@NgModule({
  declarations: [IconUrlPipe],
  imports: [CommonModule, MatIconModule],
  exports: [IconUrlPipe, MatIconModule],
})
export class SharedModule {
  constructor(
    @Inject(LOCATION) readonly location: Location,
    registry: MatIconRegistry,
    san: DomSanitizer
  ) {
    registry.addSvgIconSet(
      san.bypassSecurityTrustResourceUrl(
        `${
          location.host.includes('localhost')
            ? 'http://localhost:4200'
            : 'https://beta.esn.world'
        }/assets/icons/tumi.min.svg`
      )
    );
  }
}
