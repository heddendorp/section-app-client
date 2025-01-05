import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LoadEventQuery } from '@tumi/legacy-app/generated/generated';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-external-event-registration',
  templateUrl: './external-event-registration.component.html',
  styleUrls: ['./external-event-registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule],
})
export class ExternalEventRegistrationComponent {
  @Input() public event: LoadEventQuery['event'] | null = null;
}
