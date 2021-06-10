import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberStatus, User } from '@tumi/models';
import { Observable } from 'rxjs';
import { first, map, startWith, switchMap, tap } from 'rxjs/operators';
import { AuthService, EventService } from '@tumi/services';
import { MatDialog } from '@angular/material/dialog';
import { EventFormDialogComponent } from '../../components';
import { ConfirmDialogComponent } from '@tumi/modules/shared';

@Component({
  selector: 'app-view-event-page',
  templateUrl: 'view-event-page.component.html',
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
  public user$: Observable<User>;
  public canBeDeleted$: Observable<boolean>;
  public canSeeParticipants$: Observable<boolean>;

  constructor(
    route: ActivatedRoute,
    auth: AuthService,
    meta: Meta,
    title: Title,
    private router: Router,
    private eventService: EventService,
    private dialog: MatDialog
  ) {
    this.authenticated$ = auth.authenticated$;
    this.user$ = auth.user$;
    this.event$ = route.data.pipe(
      switchMap((data) =>
        this.eventService.getOne$(data.event.id).pipe(startWith(data.event))
      ),
      tap((event) => {
        title.setTitle(`TUMi - ${event.name}`);
        meta.updateTag(
          { property: 'og:title', content: `TUMi - ${event.name}` },
          "property='og:title'"
        );
        meta.updateTag(
          {
            property: 'og:url',
            content: `https://tumi.esn.world/events/${event.id}`,
          },
          "property='og:url'"
        );
        meta.updateTag(
          {
            property: 'og:description',
            content: event.description,
          },
          "property='og:description'"
        );
        meta.updateTag(
          {
            name: 'description',
            content: event.description,
          },
          "name='description'"
        );
        const [icon, style] = event.icon.split(':');
        meta.updateTag(
          {
            property: 'og:image',
            content: `https://img.icons8.com/${style ?? 'color'}/192/${
              icon ?? ''
            }.png?token=9b757a847e9a44b7d84dc1c200a3b92ecf6274b2`,
          },
          "property='og:image'"
        );
      })
      /*tap((event) => {
        event.registrations.subscribe((registrations: any[]) => {
          console.log(registrations);
          console.log(
            registrations
              .filter((reg) => reg.user.status === MemberStatus.full)
              .map(({ user }) => `${user.id},${user.email},${user.name}`)
              .join('\n')
          );
        });
      })*/
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
