import { Component, Input, OnInit } from '@angular/core';
import { GetEventListQuery } from '@tumi/events/graphQL';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent implements OnInit {
  @Input() public event: GetEventListQuery['events'][0] | null = null;
  constructor() {}

  ngOnInit(): void {}
}
