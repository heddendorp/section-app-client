import { isPlatformServer } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AuthService, EventService } from '@tumi/services';
import { combineLatest, Observable } from 'rxjs';
import { startWith, switchMap, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EventFormDialogComponent } from '../../components';
import { startOfToday } from 'date-fns';
import { User } from '@tumi/models';

@Component({
  selector: 'app-event-list-page',
  templateUrl: 'event-list-page.component.html',
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
  public user$: Observable<User>;
  public eventTypes = new FormControl('event');
  public dateFilter = new FormControl(startOfToday());

  constructor(
    private eventService: EventService,
    auth: AuthService,
    meta: Meta,
    title: Title,
    @Inject(PLATFORM_ID) platform: any,
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
    if (isPlatformServer(platform)) {
      this.dateFilter.disable();
      this.eventTypes.disable();
    }
    this.events$ = combineLatest([
      this.eventTypes.valueChanges.pipe(startWith(this.eventTypes.value)),
      this.dateFilter.valueChanges.pipe(startWith(this.dateFilter.value)),
    ]).pipe(
      switchMap(([types, date]) =>
        eventService.upcomingOfTypes$({ types: [types], date })
      )
    );
    this.user$ = auth.user$;
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
