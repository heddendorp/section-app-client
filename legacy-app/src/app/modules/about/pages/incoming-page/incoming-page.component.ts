import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-incoming-page',
  templateUrl: './incoming-page.component.html',
  styleUrls: ['./incoming-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomingPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
