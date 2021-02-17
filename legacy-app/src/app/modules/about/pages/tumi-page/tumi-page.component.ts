import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-tumi-page',
  templateUrl: './tumi-page.component.html',
  styleUrls: ['./tumi-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TumiPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
