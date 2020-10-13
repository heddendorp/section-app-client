import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScannerComponent } from './scanner.component';

const routes: Routes = [{ path: '', component: ScannerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScannerRoutingModule {}
