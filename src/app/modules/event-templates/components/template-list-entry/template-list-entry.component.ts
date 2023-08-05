import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  GetEventTemplatesQuery,
  GetTemplateCategoriesWithTemplatesQuery,
} from '@tumi/legacy-app/generated/generated';
import { IconURLPipe } from '@tumi/legacy-app/modules/shared/pipes/icon-url.pipe';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-template-list-entry',
    templateUrl: './template-list-entry.component.html',
    styleUrls: ['./template-list-entry.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        RouterLink,
        IconURLPipe,
    ],
})
export class TemplateListEntryComponent implements OnInit {
  @Input() template:
    | GetTemplateCategoriesWithTemplatesQuery['eventTemplateCategories'][0]['templates'][0]
    | null = null;
  constructor() {}

  ngOnInit(): void {}
}
