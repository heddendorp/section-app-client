import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-local-page',
  templateUrl: './local-page.component.html',
  styleUrls: ['./local-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocalPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
