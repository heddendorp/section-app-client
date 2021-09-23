import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShowPagePageComponent } from './pages/show-page-page/show-page-page.component';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: ':page', pathMatch: 'full', component: ShowPagePageComponent },
    ]),
    MarkdownModule,
  ],
  declarations: [ShowPagePageComponent],
})
export class UiPagesModule {}
