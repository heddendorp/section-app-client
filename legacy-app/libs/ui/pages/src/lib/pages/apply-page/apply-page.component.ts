import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'tumi-apply-page',
  templateUrl: './apply-page.component.html',
  styleUrls: ['./apply-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplyPageComponent {
  constructor(private title: Title) {
    this.title.setTitle('TUMi - apply');
  }
}
