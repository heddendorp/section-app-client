import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-event-grid',
  templateUrl: './event-grid.component.html',
  styleUrls: ['./event-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventGridComponent {
  @Input() events: any[] = [];
  @Input() showCounts = false;
  @Input() dayDividers = false;

  constructor() {}

  public getId(index: number, object: any): string {
    return object.id;
  }
}
