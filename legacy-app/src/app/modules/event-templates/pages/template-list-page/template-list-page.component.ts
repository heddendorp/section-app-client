import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventFormDialogComponent } from '@tumi/legacy-app/modules/event-templates/components/event-form-dialog/event-form-dialog.component';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom, map, Observable } from 'rxjs';
import {
  CreateEventTemplateGQL,
  GetEventTemplateCategoriesGQL,
  GetEventTemplatesGQL,
  GetEventTemplatesQuery,
  GetLonelyEventTemplatesGQL,
  GetLonelyEventTemplatesQuery,
  GetTemplateCategoriesWithTemplatesGQL,
  GetTemplateCategoriesWithTemplatesQuery,
  Role,
} from '@tumi/legacy-app/generated/generated';
import { ChangeTemplateCategoryDialogComponent } from '@tumi/legacy-app/modules/event-templates/components/change-template-category-dialog/change-template-category-dialog.component';

@Component({
  selector: 'app-template-list-page',
  templateUrl: './template-list-page.component.html',
  styleUrls: ['./template-list-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateListPageComponent {
  public Role = Role;
  public templateCategories$: Observable<
    GetTemplateCategoriesWithTemplatesQuery['eventTemplateCategories']
  >;
  public eventTemplates$: Observable<
    GetLonelyEventTemplatesQuery['eventTemplates']
  >;
  private eventTemplateQuery;

  constructor(
    private title: Title,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private createTemplateMutation: CreateEventTemplateGQL,
    private loadTemplates: GetLonelyEventTemplatesGQL,
    private getEventTemplatesGQL: GetTemplateCategoriesWithTemplatesGQL
  ) {
    this.title.setTitle('TUMi - Event templates');
    this.eventTemplateQuery = this.loadTemplates.watch(
      {},
      { fetchPolicy: 'cache-and-network' }
    );
    this.eventTemplates$ = this.eventTemplateQuery.valueChanges.pipe(
      map(({ data }) => data.eventTemplates)
    );
    this.templateCategories$ = this.getEventTemplatesGQL
      .watch()
      .valueChanges.pipe(map(({ data }) => data.eventTemplateCategories));
  }

  async createTemplate() {
    const categories = await firstValueFrom(this.templateCategories$);
    const template = await this.dialog
      .open(EventFormDialogComponent, { data: { categories } })
      .afterClosed()
      .toPromise();
    if (template) {
      this.snackBar.open('Saving template', undefined, { duration: 0 });
      await this.createTemplateMutation.mutate({ input: template }).toPromise();
      await this.eventTemplateQuery.refetch();
      this.snackBar.open('Template saved successfully');
    }
  }
}
