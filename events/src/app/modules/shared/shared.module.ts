import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconUrlPipe } from './pipes/icon-url.pipe';
import {
  MatIcon,
  MatIconModule,
  MatIconRegistry,
} from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@NgModule({
  declarations: [IconUrlPipe],
  imports: [CommonModule, MatIconModule],
  exports: [IconUrlPipe, MatIconModule],
})
export class SharedModule {
  constructor(registry: MatIconRegistry, san: DomSanitizer) {
    registry.addSvgIconSet(
      san.bypassSecurityTrustResourceUrl('./assets/icons/tumi.min.svg')
    );
  }
}
