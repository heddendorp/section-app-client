import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadPagesGQL } from '@tumi/legacy-app/generated/generated';
import { combineLatest, map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';

@Component({
    selector: 'app-show-page-page',
    templateUrl: './show-page-page.component.html',
    styleUrls: ['./show-page-page.component.scss'],
    standalone: true,
    imports: [MarkdownModule, AsyncPipe],
})
export class ShowPagePageComponent {
  public pageContent$: Observable<string>;

  constructor(private route: ActivatedRoute, private loadPages: LoadPagesGQL) {
    this.pageContent$ = combineLatest([
      this.route.paramMap,
      this.loadPages.fetch(),
    ]).pipe(
      map(([params, res]) => {
        const page = params.get('page');

        if (!page || !res.data.currentTenant) {
          return `## Page not found`;
        }
        const tenant = res.data.currentTenant;
        switch (page) {
          case 'about': {
            return tenant.aboutPage;
          }
          case 'imprint': {
            return tenant.imprintPage;
          }
          case 'privacy': {
            return tenant.privacyPolicyPage;
          }
          case 'faq': {
            return tenant.faqPage ?? `## Page not found`;
          }
          case 'tac': {
            return tenant.tacPage ?? `## Page not found`;
          }
          default: {
            return `## Page not found`;
          }
        }
      })
    );
  }
}
