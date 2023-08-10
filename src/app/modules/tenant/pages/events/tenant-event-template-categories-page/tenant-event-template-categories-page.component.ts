import { Component } from '@angular/core';
import {
  CreateEventTemplateCategoryGQL,
  LoadEventCategoriesForAdminGQL,
  LoadEventCategoriesForAdminQuery,
} from '@tumi/legacy-app/generated/generated';
import { firstValueFrom, map, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NewEventTemplateCategoryDialogComponent } from '@tumi/legacy-app/modules/tenant/components/new-event-template-category-dialog/new-event-template-category-dialog.component';
import { IconURLPipe } from '@tumi/legacy-app/modules/shared/pipes/icon-url.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf, NgFor, AsyncPipe, NgOptimizedImage } from '@angular/common';
import { ResetScrollDirective } from '../../../../shared/directives/reset-scroll.directive';
import { BackButtonComponent } from '../../../../shared/components/back-button/back-button.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveToolbarComponent } from '../../../../shared/components/reactive-toolbar/reactive-toolbar.component';

@Component({
  selector: 'app-tenant-event-template-categories-page',
  templateUrl: './tenant-event-template-categories-page.component.html',
  styleUrls: ['./tenant-event-template-categories-page.component.scss'],
  standalone: true,
  imports: [
    ReactiveToolbarComponent,
    MatToolbarModule,
    BackButtonComponent,
    ResetScrollDirective,
    NgIf,
    MatProgressBarModule,
    MatButtonModule,
    NgFor,
    AsyncPipe,
    IconURLPipe,
    NgOptimizedImage,
  ],
})
export class TenantEventTemplateCategoriesPageComponent {
  public eventTemplateCategories$: Observable<
    LoadEventCategoriesForAdminQuery['eventTemplateCategories']
  >;
  private eventTemplateCategoriesQueryRef;

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
      this.dialog
        .open(NewEventTemplateCategoryDialogComponent, { panelClass: 'modern' })
        .afterClosed(),
    );
    if (data) {
      await firstValueFrom(
        this.createEventTemplateCategoryGQL.mutate({ input: data }),
      );
      this.eventTemplateCategoriesQueryRef.refetch();
    }
  }
}
