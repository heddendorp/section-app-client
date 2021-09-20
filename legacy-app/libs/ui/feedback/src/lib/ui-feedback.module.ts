import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FeedbackPageComponent } from './pages/feedback-page/feedback-page.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: FeedbackPageComponent },
    ]),
  ],
  declarations: [FeedbackPageComponent],
})
export class UiFeedbackModule {}
