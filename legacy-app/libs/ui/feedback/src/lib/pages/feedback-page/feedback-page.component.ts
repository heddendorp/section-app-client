import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'tumi-feedback-page',
  templateUrl: './feedback-page.component.html',
  styleUrls: ['./feedback-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackPageComponent {
  constructor(private title: Title) {
    this.title.setTitle('TUMi - feedback');
  }
}
