import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'tumi-event-edit-page',
  templateUrl: './event-edit-page.component.html',
  styleUrls: ['./event-edit-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventEditPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
