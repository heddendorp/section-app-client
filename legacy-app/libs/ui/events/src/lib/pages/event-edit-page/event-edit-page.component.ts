import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  LoadEventForEditGQL,
  LoadEventForEditQuery,
  LoadUsersByStatusGQL,
  LoadUsersByStatusQuery,
  RegistrationMode,
  UpdateEventGQL,
} from '@tumi/data-access';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, map, shareReplay, switchMap, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { DateTime } from 'luxon';

@Component({
  selector: 'tumi-event-edit-page',
  templateUrl: './event-edit-page.component.html',
  styleUrls: ['./event-edit-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventEditPageComponent implements OnInit, OnDestroy {
  public RegistrationMode = RegistrationMode;
  public generalInformationForm: FormGroup;
  public users$: Observable<LoadUsersByStatusQuery['userWithStatus']>;
  public event$: Observable<LoadEventForEditQuery['event']>;
  public organizers$: Observable<LoadEventForEditQuery['organizers']>;
  private destroyed$ = new Subject();
  constructor(
    private loadEventQuery: LoadEventForEditGQL,
    private loadUsers: LoadUsersByStatusGQL,
    private updateEventMutation: UpdateEventGQL,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.generalInformationForm = this.fb.group({
      title: ['', Validators.required],
      icon: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      description: ['', Validators.required],
      organizerText: ['', Validators.required],
      registrationMode: ['', Validators.required],
      registrationLink: ['', Validators.required],
      price: ['', Validators.required],
      eventOrganizerId: ['', Validators.required],
      organizerSignup: ['', Validators.required],
      participantSignup: ['', Validators.required],
      participantLimit: ['', Validators.required],
      organizerLimit: ['', Validators.required],
    });
    this.event$ = this.route.paramMap.pipe(
      switchMap((params) =>
        this.loadEventQuery.fetch({ id: params.get('eventId') ?? '' })
      ),
      map(({ data }) => data.event),
      shareReplay(1)
    );
    this.organizers$ = this.route.paramMap.pipe(
      switchMap((params) =>
        this.loadEventQuery.fetch({ id: params.get('eventId') ?? '' })
      ),
      map(({ data }) => data.organizers),
      shareReplay(1)
    );
    this.users$ = this.event$.pipe(
      switchMap((event) =>
        this.loadUsers.fetch({ allowList: event?.organizerSignup ?? [] })
      ),
      map(({ data }) => data.userWithStatus),
      shareReplay(1)
    );
  }

  get iconValue() {
    return this.generalInformationForm.get('icon')?.value ?? '';
  }

  async ngOnInit() {
    this.generalInformationForm
      .get('registrationMode')
      ?.valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe((mode) => {
        switch (mode) {
          case RegistrationMode.Stripe: {
            this.generalInformationForm.get('price')?.enable();
            this.generalInformationForm.get('registrationLink')?.disable();
            this.generalInformationForm.get('participantLimit')?.enable();
            this.generalInformationForm.get('organizerLimit')?.enable();
            break;
          }
          case RegistrationMode.Online: {
            this.generalInformationForm.get('price')?.disable();
            this.generalInformationForm.get('registrationLink')?.disable();
            this.generalInformationForm.get('participantLimit')?.enable();
            this.generalInformationForm.get('organizerLimit')?.enable();
            break;
          }
          case RegistrationMode.External: {
            this.generalInformationForm.get('price')?.disable();
            this.generalInformationForm.get('registrationLink')?.enable();

            this.generalInformationForm.get('participantLimit')?.disable();
            this.generalInformationForm.get('organizerLimit')?.disable();
            break;
          }
        }
      });
    const event = await this.event$.pipe(first()).toPromise();
    if (event) {
      this.generalInformationForm.patchValue({
        ...event,
        start: DateTime.fromISO(event.start).toISO({ includeOffset: false }),
        end: DateTime.fromISO(event.end).toISO({ includeOffset: false }),
      });
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(false);
    this.destroyed$.complete();
  }

  async onSubmit() {
    const event = await this.event$.pipe(first()).toPromise();
    if (event && this.generalInformationForm.valid) {
      const update = this.generalInformationForm.value;
      const { data } = await this.updateEventMutation
        .mutate({
          id: event.id,
          data: {
            ...update,
            start: DateTime.fromISO(update.start).toJSDate(),
            end: DateTime.fromISO(update.end).toJSDate(),
          },
        })
        .toPromise();
      if (data) {
        delete data.updateEventGeneralInfo.__typename;
        this.generalInformationForm.setValue({
          ...data.updateEventGeneralInfo,
          start: DateTime.fromISO(data.updateEventGeneralInfo.start).toISO({
            includeOffset: false,
          }),
          end: DateTime.fromISO(data.updateEventGeneralInfo.end).toISO({
            includeOffset: false,
          }),
        });
      }
    }
  }
}
