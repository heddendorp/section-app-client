import { Routes } from '@angular/router';
import { FeedbackPageComponent } from '@tumi/legacy-app/modules/page/pages/feedback-page/feedback-page.component';
import { PrivacyPolicyPageComponent } from '@tumi/legacy-app/modules/page/pages/privacy-policy-page/privacy-policy-page.component';
import { ShowPagePageComponent } from '@tumi/legacy-app/modules/page/pages/show-page-page/show-page-page.component';

export const PAGE_ROUTES: Routes = [
  { path: 'feedback', component: FeedbackPageComponent, title: 'Feedback' },
  {
    path: 'privacy',
    component: PrivacyPolicyPageComponent,
    title: 'Privacy Policy',
  },
  { path: ':page', pathMatch: 'full', component: ShowPagePageComponent },
];
