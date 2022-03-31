import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageRoutingModule } from './page-routing.module';
import { ShowPagePageComponent } from './pages/show-page-page/show-page-page.component';
import { ApplyPageComponent } from './pages/apply-page/apply-page.component';
import { FeedbackPageComponent } from './pages/feedback-page/feedback-page.component';
import { SharedModule } from '@tumi/legacy-app/modules/shared/shared.module';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  declarations: [
    ShowPagePageComponent,
    ApplyPageComponent,
    FeedbackPageComponent,
  ],
  imports: [
    CommonModule,
    PageRoutingModule,
    SharedModule,
    MarkdownModule.forChild(),
  ],
})
export class PageModule {}
