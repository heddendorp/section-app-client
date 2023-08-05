import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { LoadEventQuery } from '@tumi/legacy-app/generated/generated';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-external-event-registration',
    templateUrl: './external-event-registration.component.html',
    styleUrls: ['./external-event-registration.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgIf, MatButtonModule],
})
export class ExternalEventRegistrationComponent {
  @Input() public event: LoadEventQuery['event'] | null = null;
}
