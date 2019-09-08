import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { Student, UserService } from '../../shared/services/user.service';
import { EventService, TumiEvent } from '../../shared/services/event.service';
import { MoneyService } from '../../shared/services/money.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-scan-request',
  templateUrl: './scan-request.component.html',
  styleUrls: ['./scan-request.component.scss']
})
export class ScanRequestComponent implements OnInit, OnDestroy {
  scanControl = new FormControl('');
  moneyControl = new FormControl(0, Validators.required);
  destroyed$ = new Subject();
  error$ = new BehaviorSubject('');
  event$ = new BehaviorSubject<TumiEvent>(null);
  user$ = new BehaviorSubject<Student>(null);
  alreadyOnEvent$ = new BehaviorSubject(false);
  eventFull$ = new BehaviorSubject(false);
  requestType$ = new BehaviorSubject('');
  canRegister$ = new BehaviorSubject(false);
  registrationDone$ = new BehaviorSubject(false);

  constructor(
    private userService: UserService,
    private eventService: EventService,
    private moneyService: MoneyService,
    private dialog: MatDialogRef<ScanRequestComponent>
  ) {}

  ngOnInit() {
    this.scanControl.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(async value => {
      let request;
      this.event$.next(null);
      this.user$.next(null);
      this.error$.next('');
      this.alreadyOnEvent$.next(false);
      this.canRegister$.next(false);
      try {
        request = JSON.parse(value);
      } catch (e) {
        console.log(e);
        this.error$.next('The value could not be read correctly');
      }
      if (!request) {
        this.error$.next('The value could not be read correctly');
        return;
      }
      if (request.action !== 'register' && request.action !== 'collectMoney') {
        this.error$.next(`The requested action (${request.action}) is not known`);
        return;
      }
      if (!request.user || !request.event) {
        this.error$.next(`The request seems to be missing data`);
        return;
      }
      const user = await this.userService
        .getUser(request.user)
        .pipe(first())
        .toPromise();
      const event = await this.eventService
        .getEventWithRegistrations(request.event)
        .pipe(first())
        .toPromise();
      if (!user || !event) {
        this.error$.next(`The event or user in this request could not be found!`);
        return;
      }
      if (event.moneyCollected && request.action === 'collectMoney') {
        this.error$.next(`Money for this event was already collected and is with ${event.moneyWith}`);
        return;
      }
      if (event.userSignups.length >= event.participantSpots) {
        this.eventFull$.next(true);
        this.error$.next(`This event is already at capacity!`);
      }
      this.moneyControl.reset(event.fullCost);
      this.requestType$.next(request.action);
      this.event$.next(event);
      this.user$.next(user);
      this.canRegister$.next(true);
      this.alreadyOnEvent$.next(event.userSignups.map(signup => signup.id).includes(user.id));
    });
  }

  async commitRegistration() {
    const event = await this.event$.pipe(first()).toPromise();
    const user = await this.user$.pipe(first()).toPromise();
    const action = await this.requestType$.pipe(first()).toPromise();
    this.scanControl.disable();
    this.canRegister$.next(false);
    if (action === 'register') {
      if (event.hasFee) {
        this.moneyService.addTransaction({
          value: event.price,
          comment: `Event Signup (${event.name}) payed by ${user.firstName} ${user.lastName} (${user.email})`
        });
      }
      await this.eventService.register(user, event);
    } else if (action === 'collectMoney') {
      if (this.moneyControl.invalid) {
        return;
      }
      if (this.moneyControl.value) {
        this.moneyService.addTransaction({
          value: -this.moneyControl.value,
          comment: `Event Money collected (${event.name}) by ${user.firstName} ${user.lastName} (${user.email})`
        });
      }
      await this.eventService.giveOutMoney(user, event, this.moneyControl.value);
    }
    this.registrationDone$.next(true);
    this.dialog.close();
  }

  ngOnDestroy(): void {
    this.destroyed$.complete();
  }
}
