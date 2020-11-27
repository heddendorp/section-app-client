import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScannerRoutingModule } from './scanner-routing.module';
import { ScannerComponent } from './scanner.component';
import { SharedModule } from '@tumi/modules/shared';

@NgModule({
  declarations: [ScannerComponent],
  imports: [CommonModule, SharedModule, ScannerRoutingModule],
})
export class ScannerModule {}
