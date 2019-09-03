import { Component, Input, OnInit } from '@angular/core';
import { TumiEvent } from '../../../../shared/services/event.service';

@Component({
  selector: 'app-display-event-info',
  templateUrl: './display-event-info.component.html',
  styleUrls: ['./display-event-info.component.scss']
})
export class DisplayEventInfoComponent implements OnInit {
  @Input() event: TumiEvent;

  constructor() {}

  ngOnInit() {}
}
