import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-chip',
  templateUrl: './user-chip.component.html',
  styleUrls: ['./user-chip.component.scss'],
})
export class UserChipComponent {
  @Input()
  public size: 'xs' | 'sm' | 'md' = 'md';
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
}
