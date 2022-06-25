import { Component, OnInit } from '@angular/core';
import {
  CreateEventTemplateCategoryGQL,
  CreateEventTemplateCategoryMutation,
  LoadEventCategoriesForAdminGQL,
  LoadEventCategoriesForAdminQuery,
} from '@tumi/legacy-app/generated/generated';
import { firstValueFrom, map, Observable } from 'rxjs';
import { NewOrganizerDialogComponent } from '@tumi/legacy-app/modules/tenant/components/new-organizer-dialog/new-organizer-dialog.component';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { NewEventTemplateCategoryDialogComponent } from '@tumi/legacy-app/modules/tenant/components/new-event-template-category-dialog/new-event-template-category-dialog.component';

@Component({
  selector: 'app-tenant-event-template-categories-page',
  templateUrl: './tenant-event-template-categories-page.component.html',
  styleUrls: ['./tenant-event-template-categories-page.component.scss'],
})
export class TenantEventTemplateCategoriesPageComponent {
  public eventTemplateCategories$: Observable<
    LoadEventCategoriesForAdminQuery['eventTemplateCategories']
  >;
  private eventTemplateCategoriesQueryRef;
  constructor(
    private title: Title,
    private dialog: MatDialog,
    private loadEventCategoriesForAdminGQL: LoadEventCategoriesForAdminGQL,
    private createEventTemplateCategoryGQL: CreateEventTemplateCategoryGQL
  ) {
    this.eventTemplateCategoriesQueryRef =
      this.loadEventCategoriesForAdminGQL.watch();
    this.eventTemplateCategories$ =
      this.eventTemplateCategoriesQueryRef.valueChanges.pipe(
        map((result) => result.data.eventTemplateCategories)
      );
  }

  async addCategory() {
    const data = await firstValueFrom(
      this.dialog.open(NewEventTemplateCategoryDialogComponent).afterClosed()
    );
    if (data) {
      await firstValueFrom(
        this.createEventTemplateCategoryGQL.mutate({ input: data })
      );
      this.eventTemplateCategoriesQueryRef.refetch();
    }
  }
}
