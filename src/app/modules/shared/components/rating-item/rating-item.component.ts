import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserChipComponent } from '../user-chip/user-chip.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-rating-item',
  templateUrl: './rating-item.component.html',
  styleUrls: ['./rating-item.component.scss'],
  standalone: true,
  imports: [NgIf, UserChipComponent, NgFor, MatButtonModule, MatIconModule],
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

  @Input()
  userPicture: string = '';

  @Input()
  userStatus: string = '';
}
