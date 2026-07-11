import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  CreateEventTemplateCategoryGQL,
  DeleteEventTemplateCategoryGQL,
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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { onlyCompleteData } from 'apollo-angular';

@Component({
  selector: 'app-tenant-event-template-categories-page',
  templateUrl: './tenant-event-template-categories-page.component.html',
  styleUrls: ['./tenant-event-template-categories-page.component.scss'],
  imports: [
    MatButtonModule,
    MatSnackBarModule,
    AsyncPipe,
    IconURLPipe,
    NgOptimizedImage,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantEventTemplateCategoriesPageComponent {
  public eventTemplateCategories$: Observable<
    LoadEventCategoriesForAdminQuery['eventTemplateCategories']
  >;
  private eventTemplateCategoriesQueryRef;
  private updateEventTemplateCategoryGQL = inject(
    UpdateEventTemplateCategoryGQL,
  );
  private deleteEventTemplateCategoryGQL = inject(
    DeleteEventTemplateCategoryGQL,
  );
  private snackBar = inject(MatSnackBar);

  constructor(
    private dialog: MatDialog,
    private loadEventCategoriesForAdminGQL: LoadEventCategoriesForAdminGQL,
    private createEventTemplateCategoryGQL: CreateEventTemplateCategoryGQL,
  ) {
    this.eventTemplateCategoriesQueryRef =
      this.loadEventCategoriesForAdminGQL.watch();
    this.eventTemplateCategories$ =
      this.eventTemplateCategoriesQueryRef.valueChanges.pipe(
        onlyCompleteData(),
        map((result) => result.data.eventTemplateCategories),
      );
  }

  async addCategory() {
    const data = await firstValueFrom(
      this.dialog.open(NewEventTemplateCategoryDialogComponent).afterClosed(),
    );
    if (data) {
      await firstValueFrom(
        this.createEventTemplateCategoryGQL.mutate({
          variables: { input: data },
        }),
      );
      await this.eventTemplateCategoriesQueryRef.refetch();
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
          variables: {
            input: data,
            id: category.id,
          },
        }),
      );
      await this.eventTemplateCategoriesQueryRef.refetch();
    }
  }

  async deleteCategory(
    category: LoadEventCategoriesForAdminQuery['eventTemplateCategories'][number],
  ) {
    const approve = confirm(
      `Are you sure you want to delete the template category "${category.name}"?`,
    );

    if (!approve) {
      return;
    }

    try {
      await firstValueFrom(
        this.deleteEventTemplateCategoryGQL.mutate({
          variables: { id: category.id },
        }),
      );
      await this.eventTemplateCategoriesQueryRef.refetch();
      this.snackBar.open('Template category deleted', 'Dismiss', {
        duration: 3000,
      });
    } catch (error) {
      this.snackBar.open(this.getErrorMessage(error), 'Dismiss', {
        duration: 5000,
      });
    }
  }

  protected templateCountLabel(count: number) {
    return `${count} template${count === 1 ? '' : 's'}`;
  }

  private getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : 'Unknown error';
  }
}
