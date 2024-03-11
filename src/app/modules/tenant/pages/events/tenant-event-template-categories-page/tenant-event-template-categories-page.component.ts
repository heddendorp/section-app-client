import { Component, inject } from '@angular/core';
import {
  CreateEventTemplateCategoryGQL,
  LoadEventCategoriesForAdminGQL,
  LoadEventCategoriesForAdminQuery,
  UpdateEventTemplateCategoryGQL,
} from '@tumi/legacy-app/generated/generated';
import { firstValueFrom, map, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NewEventTemplateCategoryDialogComponent } from '@tumi/legacy-app/modules/tenant/components/new-event-template-category-dialog/new-event-template-category-dialog.component';
import { IconURLPipe } from '@tumi/legacy-app/modules/shared/pipes/icon-url.pipe';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tenant-event-template-categories-page',
  templateUrl: './tenant-event-template-categories-page.component.html',
  styleUrls: ['./tenant-event-template-categories-page.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    AsyncPipe,
    IconURLPipe,
    NgOptimizedImage,
    RouterLink,
  ],
})
export class TenantEventTemplateCategoriesPageComponent {
  public eventTemplateCategories$: Observable<
    LoadEventCategoriesForAdminQuery['eventTemplateCategories']
  >;
  private eventTemplateCategoriesQueryRef;
  private updateEventTemplateCategoryGQL = inject(
    UpdateEventTemplateCategoryGQL,
  );

  constructor(
    private dialog: MatDialog,
    private loadEventCategoriesForAdminGQL: LoadEventCategoriesForAdminGQL,
    private createEventTemplateCategoryGQL: CreateEventTemplateCategoryGQL,
  ) {
    this.eventTemplateCategoriesQueryRef =
      this.loadEventCategoriesForAdminGQL.watch();
    this.eventTemplateCategories$ =
      this.eventTemplateCategoriesQueryRef.valueChanges.pipe(
        map((result) => result.data.eventTemplateCategories),
      );
  }

  async addCategory() {
    const data = await firstValueFrom(
      this.dialog.open(NewEventTemplateCategoryDialogComponent).afterClosed(),
    );
    if (data) {
      await firstValueFrom(
        this.createEventTemplateCategoryGQL.mutate({ input: data }),
      );
      this.eventTemplateCategoriesQueryRef.refetch();
    }
  }

  async editCategory(category: { id: string; name: string; icon: string }) {
    const data = await firstValueFrom(
      this.dialog
        .open(NewEventTemplateCategoryDialogComponent, { data: category })
        .afterClosed(),
    );
    if (data) {
      await firstValueFrom(
        this.updateEventTemplateCategoryGQL.mutate({
          input: data,
          id: category.id,
        }),
      );
    }
  }
}
