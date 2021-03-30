import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-event-organizer',
  templateUrl: './event-organizer.component.html',
  styleUrls: ['./event-organizer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventOrganizerComponent implements OnInit {
  @Input() event: any;
  constructor() {}

  ngOnInit(): void {}
}
