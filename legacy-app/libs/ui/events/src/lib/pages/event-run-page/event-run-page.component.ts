import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'tumi-event-run-page',
  templateUrl: './event-run-page.component.html',
  styleUrls: ['./event-run-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventRunPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
