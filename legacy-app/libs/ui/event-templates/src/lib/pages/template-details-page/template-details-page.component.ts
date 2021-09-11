import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GetEventTemplateGQL, GetEventTemplateQuery } from '@tumi/data-access';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'tumi-template-details-page',
  templateUrl: './template-details-page.component.html',
  styleUrls: ['./template-details-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateDetailsPageComponent implements OnInit {
  public eventTemplate$: Observable<GetEventTemplateQuery['eventTemplate']>;
  constructor(
    private getEventTemplate: GetEventTemplateGQL,
    private route: ActivatedRoute
  ) {
    this.eventTemplate$ = this.route.paramMap.pipe(
      switchMap((params) =>
        this.getEventTemplate
          .watch({ id: params.get('templateId') ?? '' })
          .valueChanges.pipe(map(({ data }) => data.eventTemplate))
      )
    );
  }

  ngOnInit(): void {}
}
