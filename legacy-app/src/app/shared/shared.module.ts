import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTableModule } from '@angular/material/table';

const materialModules = [MatButtonModule, MatToolbarModule, MatIconModule, MatTableModule];

@NgModule({
  declarations: [],
  imports: [CommonModule, materialModules, FlexLayoutModule],
  exports: [materialModules, FlexLayoutModule]
})
export class SharedModule {}
