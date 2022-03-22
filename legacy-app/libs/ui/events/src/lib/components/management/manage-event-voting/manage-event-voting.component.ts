import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import {
  LoadEventForManagementQuery,
  MembershipStatus,
} from '@tumi/data-access';

@Component({
  selector: 'tumi-manage-event-voting',
  templateUrl: './manage-event-voting.component.html',
  styleUrls: ['./manage-event-voting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageEventVotingComponent {
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
          registration.user.currentTenant.status == MembershipStatus.Full
      )
      .map((registration) => {
        return `password,${registration.user.id},${registration.user.email},${registration.user.fullName}`;
      })
      .join('\n');
  }
}
