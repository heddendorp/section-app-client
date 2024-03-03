import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LoadEventDisplayDataQuery } from '@tumi/legacy-app/generated/generated';
import { IconURLPipe } from '@tumi/legacy-app/modules/shared/pipes/icon-url.pipe';
import { MarkdownComponent } from 'ngx-markdown';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-event-display',
  standalone: true,
  imports: [IconURLPipe, MarkdownComponent, RouterLink],
  templateUrl: './event-display.component.html',
  styleUrl: './event-display.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDisplayComponent {
  public event = input.required<LoadEventDisplayDataQuery['event']>();
}
