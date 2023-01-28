import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  MembershipStatus,
  Role,
  UserProfilePublicQuery,
  UserProfileQuery,
} from '@tumi/legacy-app/generated/generated';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
})
export class ProfileCardComponent {
  @Input()
  public profile:
    | UserProfileQuery['currentUser']
    | UserProfilePublicQuery['user'];

  @Input()
  public hideEditButton = true;

  @Output()
  public edit = new EventEmitter<void>();

  public Role = Role;

  position(
    position: string | null | undefined,
    status: MembershipStatus | undefined
  ) {
    if (!!position || !status) return position;
    if (status === MembershipStatus.Trial) {
      return 'Section Member (Trial Member)';
    }
    if (status === MembershipStatus.Full) {
      return 'Section Member';
    }
    return null;
  }
}
