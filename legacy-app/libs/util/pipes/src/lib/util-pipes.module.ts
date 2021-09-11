import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconURLPipe } from './icon-url.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [IconURLPipe],
  exports: [IconURLPipe],
})
export class UtilPipesModule {}
