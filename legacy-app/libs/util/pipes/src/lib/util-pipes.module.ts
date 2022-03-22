import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IconURLPipe } from './icon-url.pipe';
import { ExtendDatePipe } from './extend-date.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [IconURLPipe, ExtendDatePipe],
  exports: [IconURLPipe, ExtendDatePipe],
  providers: [DatePipe],
})
export class UtilPipesModule {}
