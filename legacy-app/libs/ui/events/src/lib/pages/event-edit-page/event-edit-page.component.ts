import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AddOrganizerToEventGQL,
  AddSubmissionToEventGQL,
  DeregisterFromEventGQL,
  LoadEventForEditGQL,
  LoadEventForEditQuery,
  LoadUsersByStatusGQL,
  LoadUsersByStatusQuery,
  MembershipStatus,
  PublicationState,
  RegistrationMode,
  Role,
  UpdateCoreEventGQL,
  UpdateEventLocationGQL,
  UpdateGeneralEventGQL,
  UpdatePublicationGQL,
} from '@tumi/data-access';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  first,
  map,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { combineLatest, firstValueFrom, Observable, Subject } from 'rxjs';
import { DateTime } from 'luxon';
import { MatDialog } from '@angular/material/dialog';
import { SelectOrganizerDialogComponent } from '../../components/select-organizer-dialog/select-organizer-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { EventSubmissionDialogComponent } from '../../components/editing/event-submission-dialog/event-submission-dialog.component';
import { SelectLocationDialogComponent } from '@tumi/util-components';
import { PermissionsService } from '../../../../../auth/src/lib/services/permissions.service';

@Component({
  selector: 'tumi-event-edit-page',
  templateUrl: './event-edit-page.component.html',
  styleUrls: ['./event-edit-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventEditPageComponent implements OnInit, OnDestroy {
  public RegistrationMode = RegistrationMode;
  public PublicationState = PublicationState;
  public MembershipStatus = MembershipStatus;
  public Role = Role;
  public generalInformationForm: FormGroup;
  public coreInformationForm: FormGroup;
  public publicationForm: FormGroup;
  public users$: Observable<LoadUsersByStatusQuery['userWithStatus']>;
  public event$: Observable<LoadEventForEditQuery['event']>;
  public organizers$: Observable<LoadEventForEditQuery['organizers']>;
  private destroyed$ = new Subject();
  public editingProhibited$: Observable<boolean>;

  constructor(
    private title: Title,
    private loadEventQuery: LoadEventForEditGQL,
    private loadUsers: LoadUsersByStatusGQL,
    private updateGeneralEventGQL: UpdateGeneralEventGQL,
    private updateCoreEventGQL: UpdateCoreEventGQL,
    private updatePublicationMutation: UpdatePublicationGQL,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private addOrganizerMutation: AddOrganizerToEventGQL,
    private addSubmissionMutation: AddSubmissionToEventGQL,
    private updateLocationMutation: UpdateEventLocationGQL,
    private fb: FormBuilder,
    private deregisterFromEventGQL: DeregisterFromEventGQL,
    public permission: PermissionsService
  ) {
    this.title.setTitle('TUMi - edit event');
    this.publicationForm = this.fb.group({
      publicationState: ['', Validators.required],
    });
    this.generalInformationForm = this.fb.group({
      description: ['', Validators.required],
      organizerText: ['', Validators.required],
      participantText: ['', Validators.required],
    });
    this.coreInformationForm = this.fb.group({
      title: ['', Validators.required],
      icon: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      registrationStart: ['', Validators.required],
      registrationMode: ['', Validators.required],
      registrationLink: ['', Validators.required],
      prices: this.fb.group({
        options: this.fb.array([], Validators.required),
      }),
      eventOrganizerId: ['', Validators.required],
      organizerSignup: [[], Validators.required],
      participantSignup: [[], Validators.required],
      participantLimit: ['', Validators.required],
      organizerLimit: ['', Validators.required],
    });
    this.event$ = this.route.paramMap.pipe(
      switchMap(
        (params) =>
          this.loadEventQuery.watch({ id: params.get('eventId') ?? '' })
            .valueChanges
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
    this.editingProhibited$ = combineLatest([
      this.permission.hasRole([Role.Admin]),
      this.event$,
    ]).pipe(
      map(
        ([permission, event]) =>
          !(permission || event?.publicationState === PublicationState.Draft)
      ),
      tap((prohibited) => {
        if (prohibited) {
          this.coreInformationForm.disable();
        }
      })
    );
  }

  get iconValue() {
    return this.generalInformationForm.get('icon')?.value ?? '';
  }

  get prices() {
    return this.coreInformationForm.get('prices')?.get('options') as FormArray;
  }

  addPrice() {
    this.prices.push(
      this.fb.group({
        amount: ['', Validators.required],
        esnCardRequired: [false, Validators.required],
        allowedStatusList: [this.statusOptions, Validators.required],
        defaultPrice: [false, Validators.required],
      })
    );
  }

  removePrice(index: number) {
    const priceToRemove = this.prices.at(index);
    if (priceToRemove?.get('defaultPrice')?.value) {
      return;
    }
    this.prices.removeAt(index);
  }

  async ngOnInit() {
    const loader = this.snackBar.open('Loading data ⏳', undefined, {
      duration: 0,
    });
    const event = await firstValueFrom(this.event$);
    if (event?.prices?.options?.length) {
      for (let i = 0; i < event.prices.options.length; i++) {
        this.addPrice();
      }
    }
    if (event) {
      this.generalInformationForm.patchValue(event, { emitEvent: true });
      this.coreInformationForm.patchValue(
        {
          ...event,
          start: DateTime.fromISO(event.start).toISO({ includeOffset: false }),
          end: DateTime.fromISO(event.end).toISO({ includeOffset: false }),
          registrationStart: DateTime.fromISO(event.registrationStart).toISO({
            includeOffset: false,
          }),
        },
        { emitEvent: true }
      );
      this.publicationForm.patchValue(event);
    }
    this.coreInformationForm
      .get('registrationMode')
      ?.valueChanges.pipe(
        startWith(this.coreInformationForm.get('registrationMode')?.value),
        takeUntil(this.destroyed$)
      )
      .subscribe((mode) => {
        switch (mode) {
          case RegistrationMode.Stripe: {
            this.coreInformationForm.get('prices')?.enable();
            this.coreInformationForm.get('registrationLink')?.disable();
            this.coreInformationForm.get('participantLimit')?.enable();
            this.coreInformationForm.get('organizerLimit')?.enable();
            break;
          }
          case RegistrationMode.Online: {
            this.coreInformationForm.get('prices')?.disable();
            this.coreInformationForm.get('registrationLink')?.disable();
            this.coreInformationForm.get('participantLimit')?.enable();
            this.coreInformationForm.get('organizerLimit')?.enable();
            break;
          }
          case RegistrationMode.External: {
            this.coreInformationForm.get('prices')?.disable();
            this.coreInformationForm.get('registrationLink')?.enable();
            this.coreInformationForm.get('participantLimit')?.disable();
            this.coreInformationForm.get('organizerLimit')?.disable();
            break;
          }
        }
      });
    loader.dismiss();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(false);
    this.destroyed$.complete();
  }

  get statusOptions() {
    return Object.values(this.MembershipStatus);
  }

  async addOrganizer() {
    const loader = this.snackBar.open('Loading data ⏳', undefined, {
      duration: 0,
    });
    const users = await firstValueFrom(this.users$);
    const event = await firstValueFrom(this.event$);
    const choices = users.filter(
      (user) => !event?.organizers.some((organizer) => organizer.id === user.id)
    );
    loader.dismiss();
    const userId = await this.dialog
      .open(SelectOrganizerDialogComponent, { data: { choices } })
      .afterClosed()
      .toPromise();
    this.snackBar.open('Adding user ⏳', undefined, { duration: 0 });
    if (userId && event) {
      await this.addOrganizerMutation
        .mutate({ eventId: event.id, userId })
        .toPromise();
      this.snackBar.open('User added ✔️');
    }
  }

  async removeUser(registrationId: string) {
    this.snackBar.open('Removing user ⏳', undefined, { duration: 0 });
    await firstValueFrom(
      this.deregisterFromEventGQL.mutate({ registrationId })
    );
    this.snackBar.open('User removed ✔️');
  }

  async updateLocation() {
    const event = await this.event$.pipe(first()).toPromise();
    const location = await this.dialog
      .open(SelectLocationDialogComponent, { minWidth: '50vw' })
      .afterClosed()
      .toPromise();
    if (location && event) {
      await this.updateLocationMutation
        .mutate({
          eventId: event.id,
          update: {
            coordinates: location.position,
            location:
              location.type === 'POI'
                ? location.poi.name
                : location.address.freeformAddress,
          },
        })
        .toPromise();
    }
  }

  async changePublication() {
    this.snackBar.open('Saving event ⏳', undefined, {
      duration: 0,
    });
    const event = await firstValueFrom(this.event$);
    const state = this.publicationForm.get('publicationState')?.value;
    if (state && event) {
      await this.updatePublicationMutation
        .mutate({ id: event.id, state })
        .toPromise();
    }
    this.snackBar.open('Event saved ✔️');
  }

  async addSubmission() {
    const event = await firstValueFrom(this.event$);
    const res = await this.dialog
      .open(EventSubmissionDialogComponent)
      .afterClosed()
      .toPromise();
    if (event && res) {
      try {
        await this.addSubmissionMutation
          .mutate({ submissionItem: res, eventId: event.id })
          .toPromise();
        this.snackBar.open('✔️ Submission item saved');
      } catch (e) {
        this.snackBar.open(e);
      }
    }
  }

  async onSubmit() {
    this.snackBar.open('Saving event ⏳', undefined, { duration: 0 });
    const event = await firstValueFrom(this.event$);
    if (event && this.generalInformationForm.valid) {
      const update = this.generalInformationForm.value;
      const { data } = await firstValueFrom(
        this.updateGeneralEventGQL.mutate({
          id: event.id,
          data: update,
        })
      );
      if (data) {
        delete data.updateEventGeneralInfo.__typename;
        this.generalInformationForm.patchValue(data.updateEventGeneralInfo);
      }
    }
    this.snackBar.open('Event saved ✔️');
  }

  async onCoreSubmit() {
    this.snackBar.open('Saving event ⏳', undefined, { duration: 0 });
    const event = await firstValueFrom(this.event$);
    if (event && this.coreInformationForm.valid) {
      const update = this.coreInformationForm.value;
      const { data } = await firstValueFrom(
        this.updateCoreEventGQL.mutate({
          id: event.id,
          data: {
            ...update,
            start: DateTime.fromISO(update.start).toJSDate(),
            end: DateTime.fromISO(update.end).toJSDate(),
            registrationStart: DateTime.fromISO(
              update.registrationStart
            ).toJSDate(),
          },
        })
      );
      if (data) {
        delete data.updateEventCoreInfo.__typename;
        this.coreInformationForm.patchValue({
          ...data.updateEventCoreInfo,
          start: DateTime.fromISO(data.updateEventCoreInfo.start).toISO({
            includeOffset: false,
          }),
          end: DateTime.fromISO(data.updateEventCoreInfo.end).toISO({
            includeOffset: false,
          }),
          registrationStart: DateTime.fromISO(
            data.updateEventCoreInfo.registrationStart
          ).toISO({
            includeOffset: false,
          }),
        });
      }
    }
    this.snackBar.open('Event saved ✔️');
  }
}
