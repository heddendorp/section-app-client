import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  LoadEventForManagementQuery,
  MembershipStatus,
} from '@tumi/legacy-app/generated/generated';

@Component({
  selector: 'app-event-manage-voting',
  templateUrl: './event-manage-voting.component.html',
  styleUrls: ['./event-manage-voting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventManageVotingComponent {
  @Input() public event: LoadEventForManagementQuery['event'] | null = null;

  getVotingInfo() {
    if (!this.event) {
      return null;
    }

    return [
      ...this.event.organizerRegistrations,
      ...this.event.participantRegistrations,
    ]
      .filter(
        (registration) =>
          registration.user.currentTenant?.status == MembershipStatus.Full
      )
      .map((registration) => {
        return `password,${registration.user.id},${registration.user.email},${registration.user.fullName}`;
      })
      .join('\n');
  }
}
