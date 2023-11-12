import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LowerCasePipe, NgIf, NgOptimizedImage } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-user-chip',
  templateUrl: './user-chip.component.html',
  styleUrls: ['./user-chip.component.scss'],
  standalone: true,
  imports: [
    MatRippleModule,
    RouterLink,
    MatTooltipModule,
    NgIf,
    MatIconModule,
    LowerCasePipe,
    NgOptimizedImage,
  ],
})
export class UserChipComponent {
  @Input()
  public size: 'xs' | 'sm' | 'md' | 'fit' = 'md';
  @Input()
  public name: string = '';

  @Input()
  public picture: string = '';

  @Input()
  public id: string = '';

  @Input()
  public phone: string = '';

  @Input()
  public status: string = '';

  @Input()
  public checkedIn: boolean | null = null;

  @Input()
  public tag: string = '';
}
