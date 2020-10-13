import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EventService } from '../services/event.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { first, startWith, switchMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EventFormDialogComponent } from '../components';

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
    <mat-form-field
      [ngStyle.gt-xs]="{ width: '500px' }"
      [ngStyle]="{ width: '100%' }"
    >
      <mat-label>Show me</mat-label>
      <mat-select [formControl]="eventTypes" multiple>
        <mat-option value="appointment">Appointments</mat-option>
        <mat-option value="event">Events</mat-option>
        <!--        <mat-option value="bundle">Bundles</mat-option>-->
        <!--        <mat-option value="product">Products</mat-option>-->
      </mat-select>
    </mat-form-field>
    <app-event-list [events]="events$ | ngrxPush"></app-event-list>
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
  public eventTypes = new FormControl(['event', 'bundle']);

  constructor(
    private eventService: EventService,
    auth: AuthService,
    private dialog: MatDialog
  ) {
    this.events$ = this.eventTypes.valueChanges.pipe(
      startWith(this.eventTypes.value),
      switchMap((types) => eventService.upcomingOfTypes$(types))
    );
    this.isEditor$ = auth.isEditor$;
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
