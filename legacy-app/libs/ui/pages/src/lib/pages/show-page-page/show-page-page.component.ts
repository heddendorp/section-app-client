import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadPagesGQL } from '@tumi/data-access';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tumi-show-page-page',
  templateUrl: './show-page-page.component.html',
  styleUrls: ['./show-page-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
        console.log(page);
        console.log(res.data.currentTenant);
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
