import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AddOrganizerToEventGQL,
  AddSubmissionToEventGQL,
  LoadEventForEditGQL,
  LoadEventForEditQuery,
  LoadUsersByStatusGQL,
  LoadUsersByStatusQuery,
  MembershipStatus,
  PublicationState,
  RegistrationMode,
  RemoveUserFromEventGQL,
  UpdateEventGQL,
  UpdateEventLocationGQL,
  UpdatePublicationGQL,
} from '@tumi/data-access';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, map, shareReplay, switchMap, takeUntil } from 'rxjs/operators';
import { firstValueFrom, Observable, Subject } from 'rxjs';
import { DateTime } from 'luxon';
import { MatDialog } from '@angular/material/dialog';
import { SelectOrganizerDialogComponent } from '../../components/select-organizer-dialog/select-organizer-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { EventSubmissionDialogComponent } from '../../components/editing/event-submission-dialog/event-submission-dialog.component';
import { SelectLocationDialogComponent } from '@tumi/util-components';

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
  public generalInformationForm: FormGroup;
  public publicationForm: FormGroup;
  public users$: Observable<LoadUsersByStatusQuery['userWithStatus']>;
  public event$: Observable<LoadEventForEditQuery['event']>;
  public organizers$: Observable<LoadEventForEditQuery['organizers']>;
  private destroyed$ = new Subject();
  constructor(
    private title: Title,
    private loadEventQuery: LoadEventForEditGQL,
    private loadUsers: LoadUsersByStatusGQL,
    private updateEventMutation: UpdateEventGQL,
    private updatePublicationMutation: UpdatePublicationGQL,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private addOrganizerMutation: AddOrganizerToEventGQL,
    private removeUserMutation: RemoveUserFromEventGQL,
    private addSubmissionMutation: AddSubmissionToEventGQL,
    private updateLocationMutation: UpdateEventLocationGQL,
    private fb: FormBuilder
  ) {
    this.title.setTitle('TUMi - edit event');
    this.publicationForm = this.fb.group({
      publicationState: ['', Validators.required],
    });
    this.generalInformationForm = this.fb.group({
      title: ['', Validators.required],
      icon: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      description: ['', Validators.required],
      organizerText: ['', Validators.required],
      participantText: ['', Validators.required],
      registrationMode: ['', Validators.required],
      registrationLink: ['', Validators.required],
      price: ['', Validators.required],
      discountedPrice: ['', Validators.required],
      esnDiscount: ['', Validators.required],
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
  }

  get iconValue() {
    return this.generalInformationForm.get('icon')?.value ?? '';
  }

  async ngOnInit() {
    const loader = this.snackBar.open('Loading data ⏳', undefined, {
      duration: 0,
    });
    this.generalInformationForm
      .get('esnDiscount')
      ?.valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe((discount) => {
        if (discount) {
          this.generalInformationForm.get('discountedPrice')?.enable();
        } else {
          this.generalInformationForm.get('discountedPrice')?.disable();
        }
      });
    this.generalInformationForm
      .get('registrationMode')
      ?.valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe((mode) => {
        switch (mode) {
          case RegistrationMode.Stripe: {
            this.generalInformationForm.get('price')?.enable();
            this.generalInformationForm.get('discountedPrice')?.enable();
            this.generalInformationForm.get('esnDiscount')?.enable();
            this.generalInformationForm.get('registrationLink')?.disable();
            this.generalInformationForm.get('participantLimit')?.enable();
            this.generalInformationForm.get('organizerLimit')?.enable();
            break;
          }
          case RegistrationMode.Online: {
            this.generalInformationForm.get('price')?.disable();
            this.generalInformationForm.get('discountedPrice')?.disable();
            this.generalInformationForm.get('esnDiscount')?.disable();
            this.generalInformationForm.get('registrationLink')?.disable();
            this.generalInformationForm.get('participantLimit')?.enable();
            this.generalInformationForm.get('organizerLimit')?.enable();
            break;
          }
          case RegistrationMode.External: {
            this.generalInformationForm.get('price')?.disable();
            this.generalInformationForm.get('discountedPrice')?.disable();
            this.generalInformationForm.get('esnDiscount')?.disable();
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
      this.publicationForm.patchValue(event);
    }
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

  async removeUser(userId: string) {
    this.snackBar.open('Removing user ⏳', undefined, { duration: 0 });
    const event = await this.event$.pipe(first()).toPromise();
    await this.removeUserMutation
      .mutate({ eventId: event?.id ?? '', userId })
      .toPromise();
    this.snackBar.open('User removed ✔️');
  }

  async onSubmit() {
    this.snackBar.open('Saving event ⏳', undefined, { duration: 0 });
    const event = await this.event$.pipe(first()).toPromise();
    if (event && this.generalInformationForm.valid) {
      const update = this.generalInformationForm.value;
      const { data } = await firstValueFrom(
        this.updateEventMutation.mutate({
          id: event.id,
          data: {
            ...update,
            start: DateTime.fromISO(update.start).toJSDate(),
            end: DateTime.fromISO(update.end).toJSDate(),
          },
        })
      );
      if (data) {
        delete data.updateEventGeneralInfo.__typename;
        this.generalInformationForm.patchValue({
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
    this.snackBar.open('Event saved ✔️');
  }

  async updateLocation() {
    const event = await this.event$.pipe(first()).toPromise();
    const location = await this.dialog
      .open(SelectLocationDialogComponent, { minWidth: '50vw' })
      .afterClosed()
      .toPromise();
    if (location && event) {
      console.log(location);
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
    const event = await this.event$.pipe(first()).toPromise();
    const state = this.publicationForm.get('publicationState')?.value;
    if (state && event) {
      await this.updatePublicationMutation
        .mutate({ id: event.id, state })
        .toPromise();
    }
    this.snackBar.open('Event saved ✔️');
  }

  async addSubmission() {
    const event = await this.event$.pipe(first()).toPromise();
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
}
