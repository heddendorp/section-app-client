import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AuthService, EventService } from '@tumi/services';
import { first, shareReplay, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-event-attendance',
  templateUrl: './event-attendance.component.html',
  styleUrls: ['./event-attendance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventAttendanceComponent implements OnInit {
  public event$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.event$ = this.route.paramMap.pipe(
      tap((event) => console.log(event)),
      switchMap((params) => this.eventService.getOne$(params.get('id') ?? '')),
      shareReplay(1)
    );
  }

  async updateRegistration(
    registration: any,
    hasAttended: boolean
  ): Promise<void> {
    const event = await this.event$.pipe(first()).toPromise();
    await this.eventService.updateRegistration(event.id, registration.id, {
      hasAttended,
    });
  }
}
