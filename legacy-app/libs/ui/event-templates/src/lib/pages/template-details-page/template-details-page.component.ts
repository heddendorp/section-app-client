import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateEventFromTemplateGQL,
  DeleteEventTemplateGQL,
  GetEventTemplateGQL,
  GetEventTemplateQuery,
  GetOrganizerOptionsGQL,
  UpdateEventTemplateGQL,
  UpdateTemplateLocationGQL,
} from '@tumi/data-access';
import { ActivatedRoute, Router } from '@angular/router';
import { first, map, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { CreateEventDialogComponent } from '../../components/create-event-dialog/create-event-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventFormDialogComponent } from '../../components/event-form-dialog/event-form-dialog.component';
import { Title } from '@angular/platform-browser';
import { SelectLocationDialogComponent } from '../../components/select-location-dialog/select-location-dialog.component';

@Component({
  selector: 'tumi-template-details-page',
  templateUrl: './template-details-page.component.html',
  styleUrls: ['./template-details-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateDetailsPageComponent implements OnInit {
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
    private deleteTemplateMutation: DeleteEventTemplateGQL
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

  ngOnInit(): void {}

  async createEvent() {
    const template = await this.eventTemplate$.pipe(first()).toPromise();
    const { data } = await this.getOrganizerOptions.fetch().toPromise();
    if (template?.id) {
      const eventData = await this.dialog
        .open(CreateEventDialogComponent, {
          data: { template, organizers: data.organizers },
        })
        .afterClosed()
        .toPromise();
      if (eventData) {
        this.snackBar.open('Saving event', undefined, { duration: 0 });
        const { data } = await this.createEventMutation
          .mutate({ templateId: template.id, eventData })
          .toPromise();
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

  async updateLocation() {
    const template = await this.eventTemplate$.pipe(first()).toPromise();
    const location = await this.dialog
      .open(SelectLocationDialogComponent, { minWidth: '50vw' })
      .afterClosed()
      .toPromise();
    if (location && template) {
      console.log(location);
      await this.updateLocationMutation
        .mutate({
          templateId: template.id,
          update: {
            coordinates: location.position,
            location:
              location.type === 'POI'
                ? location.poi.name
                : location.address.freeformAddress,
          },
        })
        .toPromise();
    }
  }
}
