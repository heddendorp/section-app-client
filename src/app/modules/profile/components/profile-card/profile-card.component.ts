import { Component, Input } from '@angular/core';
import {
  MembershipStatus,
  Role,
  UserProfileQuery,
} from '@tumi/legacy-app/generated/generated';
import { RouterLink } from '@angular/router';
import { IfRoleDirective } from '../../../shared/directives/if-role.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import {
  LowerCasePipe,
  NgIf,
  NgOptimizedImage,
  UpperCasePipe,
} from '@angular/common';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    IfRoleDirective,
    RouterLink,
    UpperCasePipe,
    LowerCasePipe,
    NgOptimizedImage,
  ],
})
export class ProfileCardComponent {
  @Input()
  public profile: UserProfileQuery['currentUser'];

  public Role = Role;

  position(
    position: string | null | undefined,
    status: MembershipStatus | undefined,
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
