import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map, startWith, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { EventFormDialogComponent } from '../components';
import { EventService } from '../../../services/event.service';
import { ConfirmDialogComponent } from '../../shared/components';

@Component({
  selector: 'app-view-event-page',
  template: `
    <ng-container *ngrxLet="event$; let event">
      <div
        fxLayout="row"
        fxLayoutAlign="space-between center"
        fxLayoutGap="8px"
        style="margin-bottom: 1rem;"
      >
        <h1 style="margin: 0;" fxFlex="grow">{{ event.name }}</h1>
        <button
          [matMenuTriggerFor]="menu"
          fxFlex="noshrink"
          mat-flat-button
          color="accent"
          *ngIf="isEditor$ | ngrxPush"
        >
          Edit
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="editEvent()">Edit event</button>
          <button mat-menu-item disabled>Archive Event</button>
          <button
            mat-menu-item
            [disabled]="!(canBeDeleted$ | ngrxPush)"
            (click)="deleteEvent()"
          >
            Delete Event
          </button>
        </mat-menu>
      </div>
      <markdown [data]="event.description" emoji></markdown>
      <ng-container *ngIf="isTutor$ | ngrxPush">
        <markdown [data]="event.runningNotes" emoji></markdown>
      </ng-container>
      <div gdAuto gdColumns="repeat(auto-fit, minmax(350px, 1fr))" gdGap="1rem">
        <ng-container
          [ngSwitch]="event.registrationMode"
          *ngIf="authenticated$ | ngrxPush; else loginPrompt"
        >
          <ng-container *ngSwitchCase="'online'">
            <app-tutor-registration
              [event]="event"
              *ngIf="isTutor$ | ngrxPush"
            ></app-tutor-registration>
            <app-online-registration [event]="event"></app-online-registration>
          </ng-container>
          <ng-container *ngSwitchCase="'office'">
            <app-tutor-registration
              *ngIf="isTutor$ | ngrxPush"
              [event]="event"
            ></app-tutor-registration>
            <app-office-registration [event]="event"></app-office-registration>
          </ng-container>
          <ng-container *ngSwitchCase="'external'">
            <app-external-registration
              [event]="event"
            ></app-external-registration>
          </ng-container>
        </ng-container>
        <app-collect-money
          *ngIf="(canSeeParticipants$ | ngrxPush) && event.fullCost"
          [event]="event"
        ></app-collect-money>
        <ng-template #loginPrompt>
          <app-anonymous-registration></app-anonymous-registration
        ></ng-template>
      </div>
      <app-event-participants
        [event]="event"
        *ngIf="canSeeParticipants$ | ngrxPush"
      ></app-event-participants>
    </ng-container>
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
export class ViewEventPageComponent {
  public event$: Observable<any>;
  public authenticated$: Observable<boolean>;
  public isTutor$: Observable<boolean>;
  public isEditor$: Observable<boolean>;
  public canBeDeleted$: Observable<boolean>;
  public canSeeParticipants$: Observable<boolean>;
  constructor(
    route: ActivatedRoute,
    auth: AuthService,
    private router: Router,
    private eventService: EventService,
    private dialog: MatDialog
  ) {
    this.authenticated$ = auth.authenticated$;
    this.isTutor$ = auth.isTutor$;
    this.isEditor$ = auth.isEditor$;
    this.event$ = route.data.pipe(
      switchMap((data) =>
        this.eventService.getOne$(data.event.id).pipe(startWith(data.event))
      )
    );
    this.canBeDeleted$ = this.event$.pipe(
      map(
        (event) => event.usersSignedUp === 0 && event.tutorSignups.length === 0
      )
    );
    this.canSeeParticipants$ = this.event$.pipe(
      switchMap((event) => auth.canSeeParticipants$(event))
    );
  }

  async editEvent(): Promise<void> {
    const event = await this.event$.pipe(first()).toPromise();
    const newEvent = await this.dialog
      .open(EventFormDialogComponent, {
        data: { event },
        minWidth: '90vw',
        // minHeight: '90vh',
      })
      .afterClosed()
      .toPromise();
    if (newEvent) {
      await this.eventService.updateEvent(event.id, newEvent);
    }
  }

  async deleteEvent(): Promise<void> {
    const event = await this.event$.pipe(first()).toPromise();
    const proceed = await this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: `Do you really want to delete ${event.name}?`,
          result: true,
        },
      })
      .afterClosed()
      .toPromise();
    if (!proceed) {
      return;
    }
    await this.eventService.deleteEvent(event.id);
    await this.router.navigateByUrl('/events');
  }
}
