import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'tumi-feedback-page',
  templateUrl: './feedback-page.component.html',
  styleUrls: ['./feedback-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
