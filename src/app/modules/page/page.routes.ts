import { Routes } from '@angular/router';
import { FeedbackPageComponent } from '@tumi/legacy-app/modules/page/pages/feedback-page/feedback-page.component';
import { ShowPagePageComponent } from '@tumi/legacy-app/modules/page/pages/show-page-page/show-page-page.component';

export const PAGE_ROUTES: Routes = [
  { path: 'feedback', component: FeedbackPageComponent, title: 'Feedback' },
  { path: ':page', pathMatch: 'full', component: ShowPagePageComponent },
];
