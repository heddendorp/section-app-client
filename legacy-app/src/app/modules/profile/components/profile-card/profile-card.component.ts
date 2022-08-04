import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserProfilePublicQuery, UserProfileQuery } from '@tumi/legacy-app/generated/generated';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
})
export class ProfileCardComponent {
  @Input()
  public profile : UserProfileQuery['currentUser'] | UserProfilePublicQuery['user'];

  @Input()
  public hideEditButton = true;

  @Output()
  public edit = new EventEmitter<void>();
}
