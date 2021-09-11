import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { GetEventTemplatesQuery } from '@tumi/data-access';

@Component({
  selector: 'tumi-template-list-entry',
  templateUrl: './template-list-entry.component.html',
  styleUrls: ['./template-list-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateListEntryComponent implements OnInit {
  @Input() template: GetEventTemplatesQuery['eventTemplates'][0] | null = null;
  constructor() {}

  ngOnInit(): void {}
}
