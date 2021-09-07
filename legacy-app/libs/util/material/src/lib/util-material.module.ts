import { NgModule } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@NgModule({
  imports: [MatIconModule],
  exports: [MatIconModule],
})
export class UtilMaterialModule {
  constructor(registry: MatIconRegistry, san: DomSanitizer) {
    registry.addSvgIconSet(
      san.bypassSecurityTrustResourceUrl('./assets/icons/set.svg')
    );
  }
}
