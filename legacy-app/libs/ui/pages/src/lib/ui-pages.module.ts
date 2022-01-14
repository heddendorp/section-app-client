import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShowPagePageComponent } from './pages/show-page-page/show-page-page.component';
import { MarkdownModule } from 'ngx-markdown';
import { ApplyPageComponent } from './pages/apply-page/apply-page.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: 'apply', component: ApplyPageComponent },
      { path: ':page', pathMatch: 'full', component: ShowPagePageComponent },
    ]),
    MarkdownModule,
  ],
  declarations: [ShowPagePageComponent, ApplyPageComponent],
})
export class UiPagesModule {}
