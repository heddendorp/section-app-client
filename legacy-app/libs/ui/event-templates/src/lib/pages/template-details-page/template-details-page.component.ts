import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateEventFromTemplateGQL,
  GetEventTemplateGQL,
  GetEventTemplateQuery,
  GetOrganizerOptionsGQL,
} from '@tumi/data-access';
import { ActivatedRoute, Router } from '@angular/router';
import { first, map, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { CreateEventDialogComponent } from '../../components/create-event-dialog/create-event-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tumi-template-details-page',
  templateUrl: './template-details-page.component.html',
  styleUrls: ['./template-details-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateDetailsPageComponent implements OnInit {
  public eventTemplate$: Observable<GetEventTemplateQuery['eventTemplate']>;
  constructor(
    private getEventTemplate: GetEventTemplateGQL,
    private createEventMutation: CreateEventFromTemplateGQL,
    private getOrganizerOptions: GetOrganizerOptionsGQL,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
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
}
