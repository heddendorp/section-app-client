import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AuthService, EventService } from '@tumi/services';
import { combineLatest, Observable } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EventFormDialogComponent } from '../components';
import { startOfToday } from 'date-fns';

@Component({
  selector: 'app-event-list-page',
  template: `
    <div
      fxLayout="row"
      fxLayoutAlign="space-between center"
      style="margin-bottom: 1rem;"
    >
      <h1 style="margin: 0;">Events</h1>
      <button
        mat-flat-button
        color="accent"
        *ngIf="isEditor$ | ngrxPush"
        (click)="createEvent()"
      >
        Add Event
      </button>
    </div>
    <div fxLayout="column" fxLayout.gt-sm="row" fxLayoutGap="1rem">
      <mat-form-field fxFlex="auto">
        <mat-label>Show me</mat-label>
        <mat-select [formControl]="eventTypes" multiple>
          <mat-option value="appointment">Appointments</mat-option>
          <mat-option value="event">Events</mat-option>
          <!--        <mat-option value="bundle">Bundles</mat-option>-->
          <!--        <mat-option value="product">Products</mat-option>-->
        </mat-select>
      </mat-form-field>
      <mat-form-field fxFlex="auto" *ngIf="isTutor$ | ngrxPush">
        <mat-label>Show events starting after</mat-label>
        <input matInput [formControl]="dateFilter" [matDatepicker]="picker" />
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>
    </div>
    <app-event-grid
      [events]="events$ | ngrxPush"
      [showCounts]="isTutor$ | ngrxPush"
      [dayDividers]="true"
    ></app-event-grid>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 1rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventListPageComponent {
  public events$: Observable<any[]>;
  public isEditor$: Observable<boolean>;
  public isTutor$: Observable<boolean>;
  public eventTypes = new FormControl(['event', 'bundle']);
  public dateFilter = new FormControl(startOfToday());

  constructor(
    private eventService: EventService,
    auth: AuthService,
    meta: Meta,
    title: Title,
    private dialog: MatDialog
  ) {
    title.setTitle('TUMi - events');
    meta.updateTag(
      { property: 'og:title', content: 'TUMi - events' },
      "property='og:title'"
    );
    meta.updateTag(
      { property: 'og:url', content: `https://tumi.esn.world/events` },
      "property='og:url'"
    );
    meta.updateTag(
      {
        property: 'og:description',
        content: 'Upcoming events for locals and internationals by ESN TUMi',
      },
      "property='og:description'"
    );
    meta.updateTag(
      {
        name: 'description',
        content: 'Upcoming events for locals and internationals by ESN TUMi',
      },
      "name='description'"
    );
    this.events$ = combineLatest([
      this.eventTypes.valueChanges.pipe(startWith(this.eventTypes.value)),
      this.dateFilter.valueChanges.pipe(startWith(this.dateFilter.value)),
    ]).pipe(
      switchMap(([types, date]) =>
        eventService.upcomingOfTypes$({ types, date })
      )
    );
    this.isEditor$ = auth.isEditor$;
    this.isTutor$ = auth.isTutor$;
  }

  public async createEvent(): Promise<void> {
    const newEvent = await this.dialog
      .open(EventFormDialogComponent, {
        minWidth: '90vw',
        // minHeight: '90vh',
      })
      .afterClosed()
      .toPromise();
    if (newEvent) {
      await this.eventService.addEvent(newEvent);
    }
  }
}
