import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CreateEventDialogComponent } from '@tumi/legacy-app/modules/event-templates/components/create-event-dialog/create-event-dialog.component';
import {
  CreateEventFromTemplateGQL,
  DeleteEventTemplateGQL,
  GetEventTemplateCategoriesGQL,
  GetEventTemplateGQL,
  GetEventTemplateQuery,
  GetOrganizerOptionsGQL,
  Role,
  UpdateEventTemplateCategoryAssignmentGQL,
  UpdateEventTemplateGQL,
  UpdateTemplateLocationGQL,
} from '@tumi/legacy-app/generated/generated';
import { first, firstValueFrom, map, Observable, switchMap } from 'rxjs';
import { EventFormDialogComponent } from '@tumi/legacy-app/modules/event-templates/components/event-form-dialog/event-form-dialog.component';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectLocationDialogComponent } from '@tumi/legacy-app/modules/shared/components/select-location-dialog/select-location-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeTemplateCategoryDialogComponent } from '@tumi/legacy-app/modules/event-templates/components/change-template-category-dialog/change-template-category-dialog.component';

@Component({
  selector: 'app-template-details-page',
  templateUrl: './template-details-page.component.html',
  styleUrls: ['./template-details-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateDetailsPageComponent {
  public Role = Role;

  public eventTemplate$: Observable<GetEventTemplateQuery['eventTemplate']>;
  constructor(
    private title: Title,
    private getEventTemplate: GetEventTemplateGQL,
    private createEventMutation: CreateEventFromTemplateGQL,
    private getOrganizerOptions: GetOrganizerOptionsGQL,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private updateTemplate: UpdateEventTemplateGQL,
    private updateLocationMutation: UpdateTemplateLocationGQL,
    private deleteTemplateMutation: DeleteEventTemplateGQL,
    private getEventTemplateCategoriesGQL: GetEventTemplateCategoriesGQL,
    private updateEventTemplateCategoryAssignmentGQL: UpdateEventTemplateCategoryAssignmentGQL
  ) {
    this.title.setTitle('TUMi - Event template');
    this.eventTemplate$ = this.route.paramMap.pipe(
      switchMap((params) =>
        this.getEventTemplate
          .watch({ id: params.get('templateId') ?? '' })
          .valueChanges.pipe(map(({ data }) => data.eventTemplate))
      )
    );
  }

  async createEvent() {
    const template = await firstValueFrom(this.eventTemplate$);
    const { data } = await firstValueFrom(this.getOrganizerOptions.fetch());
    if (template?.id) {
      const eventData = await this.dialog
        .open(CreateEventDialogComponent, {
          data: { template, organizers: data.eventOrganizers },
        })
        .afterClosed()
        .toPromise();
      if (eventData) {
        this.snackBar.open('Saving event', undefined, { duration: 0 });
        const { data } = await firstValueFrom(
          this.createEventMutation.mutate({
            templateId: template.id,
            eventData,
          })
        );
        this.snackBar.open('Event saved successfully');
        if (data) {
          await this.router.navigate([
            '/',
            'events',
            data.createEventFromTemplate?.id,
            'edit',
          ]);
        }
      }
    }
  }

  async editTemplate() {
    const template = await this.eventTemplate$.pipe(first()).toPromise();
    const update = await this.dialog
      .open(EventFormDialogComponent, { data: { template } })
      .afterClosed()
      .toPromise();
    if (update && template) {
      this.snackBar.open('Saving template ⏳', undefined, { duration: 0 });
      await this.updateTemplate
        .mutate({ templateId: template.id, update })
        .toPromise();
      this.snackBar.open('Template saved successfully ✔️');
    }
  }

  async deleteTemplate() {
    const template = await this.eventTemplate$.pipe(first()).toPromise();
    const approve = confirm(
      `Do you really want to delete '${template?.title}'?`
    );
    if (approve && template) {
      await this.deleteTemplateMutation
        .mutate({ templateId: template.id })
        .toPromise();
      await this.router.navigate(['event-templates']);
    }
  }

  async changeCategory() {
    const categories = await firstValueFrom(
      this.getEventTemplateCategoriesGQL.fetch()
    );
    const template = await firstValueFrom(this.eventTemplate$);
    const category = await firstValueFrom(
      this.dialog
        .open(ChangeTemplateCategoryDialogComponent, {
          data: { categories: categories.data.eventTemplateCategories },
        })
        .afterClosed()
    );
    if (category && template) {
      await firstValueFrom(
        this.updateEventTemplateCategoryAssignmentGQL.mutate({
          templateId: template.id,
          categoryId: category,
        })
      );
    }
  }

  async updateLocation() {
    const template = await this.eventTemplate$.pipe(first()).toPromise();
    const location = await firstValueFrom(
      await this.dialog
        .open(SelectLocationDialogComponent, { minWidth: '50vw' })
        .afterClosed()
    );
    if (location && template) {
      await firstValueFrom(
        this.updateLocationMutation.mutate({
          templateId: template.id,
          update: {
            coordinates: location.position,
            googlePlaceId: location.place_id,
            googlePlaceUrl: location.url,
            location: location.structured_formatting.main_text,
          },
        })
      );
    }
  }
}
