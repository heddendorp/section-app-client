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

@Component({
  selector: 'app-template-list-entry',
  templateUrl: './template-list-entry.component.html',
  styleUrls: ['./template-list-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateListEntryComponent implements OnInit {
  @Input() template:
    | GetTemplateCategoriesWithTemplatesQuery['eventTemplateCategories'][0]['templates'][0]
    | null = null;
  constructor() {}

  ngOnInit(): void {}
}
