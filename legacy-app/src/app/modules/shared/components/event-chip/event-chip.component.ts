import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-event-chip',
  templateUrl: './event-chip.component.html',
  styleUrls: ['./event-chip.component.scss'],
})
export class EventChipComponent {
  @Input()
  public icon: string = '';

  @Input()
  public id: string = '';

  @Input()
  public title: string = '';
}
