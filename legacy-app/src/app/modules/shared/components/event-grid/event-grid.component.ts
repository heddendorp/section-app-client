import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-event-grid',
  templateUrl: './event-grid.component.html',
  styleUrls: ['./event-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventGridComponent {
  @Input() events: any[] = [];
  @Input() showCounts = false;
  constructor() {}

  public getId(index: number, object: any): string {
    return object.id;
  }
}
