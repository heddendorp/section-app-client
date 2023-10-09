import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtendDatePipe } from '@tumi/legacy-app/modules/shared/pipes/extended-date.pipe';
import { RegistrationStatus } from '@tumi/legacy-app/generated/generated';

export type ParticipantTableSubmissionItem = {
  name: string;
  id: string;
};
export type ParticipantTableSubmission = {
  data: {
    value: string;
  };
};
export type ParticipantTableRegistration = {
  status: RegistrationStatus;
  submissions: ParticipantTableSubmission[];
  checkInTime?: string | null;
  user: {
    fullName: string;
    email: string;
    phone?: string | null;
  };
};

@Component({
  selector: 'app-event-participants-table',
  standalone: true,
  imports: [CommonModule, ExtendDatePipe],
  templateUrl: './event-participants-table.component.html',
  styleUrls: ['./event-participants-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventParticipantsTableComponent {
  @Input() event?: {
    title: string;
    submissionItems: ParticipantTableSubmissionItem[];
    start: string;
    organizerRegistrations: Omit<
      ParticipantTableRegistration,
      'submissions' | 'status'
    >[];
    participantRegistrations: ParticipantTableRegistration[];
    participantRegistrationCount: number;
  };

  filterRegistrations(
    participantRegistrations: ParticipantTableRegistration[],
  ) {
    return participantRegistrations
      .filter((r) => r.status !== RegistrationStatus.Cancelled)
      .sort((a: any, b: any) => a.user.lastName.localeCompare(b.user.lastName));
  }

  getSubmissionValue(
    registration: ParticipantTableRegistration,
    submissionItem: ParticipantTableSubmissionItem,
  ) {
    return registration.submissions.find(
      (s: any) => s.submissionItem.id === submissionItem.id,
    )?.data?.value;
  }

  joinOrganizers(
    organizerRegistrations: Omit<
      ParticipantTableRegistration,
      'submissions' | 'status'
    >[],
  ) {
    return organizerRegistrations.map((r) => r.user.fullName).join(', ');
  }
}
