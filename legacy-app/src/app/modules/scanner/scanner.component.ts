import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EventService, MoneyService, UserService } from '@tumi/services';
import { FormControl } from '@angular/forms';
import { combineLatest, concat, Observable, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  first,
  map,
  shareReplay,
  switchMap,
} from 'rxjs/operators';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScannerComponent {
  public scanControl = new FormControl('');
  public user$: Observable<any>;
  public events$: Observable<any[] | null>;

  constructor(
    private eventService: EventService,
    private userService: UserService,
    private moneyService: MoneyService
  ) {
    const currentRequest = this.scanControl.valueChanges.pipe(
      debounceTime(300),
      map((request) => JSON.parse(request)),
      catchError((err, caught) => concat(of(null), caught))
    );
    this.user$ = currentRequest.pipe(
      switchMap((request) =>
        request ? this.userService.getUser$(request.user) : of(null)
      ),
      shareReplay()
    );
    this.events$ = currentRequest.pipe(
      switchMap((request) =>
        request
          ? combineLatest<any[]>(
              request.events.map((eRequest: any) =>
                this.eventService
                  .getOne$(eRequest.id)
                  .pipe(map((event) => ({ action: eRequest.action, event })))
              )
            )
          : of(null)
      ),
      switchMap((requests: any) =>
        requests?.length
          ? combineLatest<any[]>(
              requests.map((request: any) =>
                combineLatest([request.event.registrations, this.user$]).pipe(
                  map(([registrations, user]: [any, any]) => {
                    const warnings: string[] = [];
                    let onWaitlist = false;
                    let registered = false;
                    const registration = registrations.find(
                      (r: any) => r.id === user.id
                    );
                    if (request.event.moneyCollected) {
                      warnings.push(
                        `Money already collected by ${request.event.moneyWith}`
                      );
                    }
                    if (
                      registrations.length >= request.event.participantSpots
                    ) {
                      onWaitlist = true;
                      warnings.push(
                        'Event full; Registration will be on the waitlist'
                      );
                    }
                    if (registration) {
                      registered = true;
                      if (request.action === 'register') {
                        warnings.push(
                          'User is already registered for this event'
                        );
                      }
                      if (
                        request.action === 'refund' &&
                        !registration.isWaitList
                      ) {
                        warnings.push(
                          'User is not on the waitlist for this event'
                        );
                      }
                    }
                    return {
                      ...request,
                      registrations,
                      warnings,
                      onWaitlist,
                      registered,
                    };
                  })
                )
              )
            )
          : of(null)
      )
    );
  }

  public async registerUser(request: any): Promise<void> {
    const user = await this.user$.pipe(first()).toPromise();
    if (request.event.hasFee) {
      await this.moneyService.addEventTransaction(
        `Event registration (${request.event.name}) payed by ${user.firstName} ${user.lastName} (${user.email})`,
        request.event,
        user,
        'registration'
      );
    }
    await this.eventService.register(user, request.event);
  }

  public async deregisterUser(request: any): Promise<void> {
    const user = await this.user$.pipe(first()).toPromise();
    if (request.event.hasFee) {
      await this.moneyService.addEventTransaction(
        `Event Refund (${request.event.name}) payed to ${user.firstName} ${user.lastName} (${user.email})`,
        request.event,
        user,
        'refund'
      );
    }
    await this.eventService.deregister(user, request.event);
  }

  async addUserToWaitList(request: any): Promise<void> {
    const user = await this.user$.pipe(first()).toPromise();
    if (request.event.hasFee) {
      await this.moneyService.addEventTransaction(
        `Wait list registration (${request.event.name}) payed by ${user.firstName} ${user.lastName} (${user.email})`,
        request.event,
        user,
        'registration'
      );
    }
    await this.eventService.register(user, request.event, true);
  }

  public async collectMoney(request: any): Promise<void> {
    const user = await this.user$.pipe(first()).toPromise();
    if (request.event.fullCost) {
      await this.moneyService.addEventTransaction(
        `Event Money collected (${request.event.name}) by ${user.firstName} ${user.lastName} (${user.email})`,
        request.event,
        user,
        'moneyCollection'
      );
    }
    await this.eventService.updateEvent(request.event.id, {
      moneyCollected: true,
      moneyWith: `${user.firstName} ${user.lastName} (${user.email})`,
    });
  }

  public reset(): void {
    this.scanControl.reset('');
  }
}
