import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedbackPageComponent } from '@tumi/legacy-app/modules/page/pages/feedback-page/feedback-page.component';
import { ApplyPageComponent } from '@tumi/legacy-app/modules/page/pages/apply-page/apply-page.component';
import { ShowPagePageComponent } from '@tumi/legacy-app/modules/page/pages/show-page-page/show-page-page.component';

const routes: Routes = [
  { path: 'apply', component: ApplyPageComponent },
  { path: 'feedback', component: FeedbackPageComponent, title: 'Feedback' },
  { path: ':page', pathMatch: 'full', component: ShowPagePageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageRoutingModule {}
