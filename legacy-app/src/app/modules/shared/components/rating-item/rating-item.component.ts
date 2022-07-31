import { Component, Input } from '@angular/core';
import { PermissionsService } from '../../services/permissions.service';

@Component({
  selector: 'app-rating-item',
  templateUrl: './rating-item.component.html',
  styleUrls: ['./rating-item.component.scss'],
})
export class RatingItemComponent {
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

  public constructor(public permissions: PermissionsService) {}
}
