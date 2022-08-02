import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PermissionsService } from '../../services/permissions.service';

@Component({
  selector: 'app-rating-item',
  templateUrl: './rating-item.component.html',
  styleUrls: ['./rating-item.component.scss'],
})
export class RatingItemComponent {
  @Input()
  isCurrentUser: boolean = false;

  @Output()
  edit = new EventEmitter<void>();

  @Input()
  isOrganizer: boolean = false;

  @Input()
  isAnonymous: boolean = true;

  @Input()
  rating: number = 0;

  @Input()
  comment: string = '';

  @Input()
  userId: string = '';

  @Input()
  userFullName: string = '';
}
