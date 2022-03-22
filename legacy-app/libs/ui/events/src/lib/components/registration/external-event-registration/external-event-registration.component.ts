import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { LoadEventQuery } from '@tumi/data-access';

@Component({
  selector: 'tumi-external-event-registration',
  templateUrl: './external-event-registration.component.html',
  styleUrls: ['./external-event-registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalEventRegistrationComponent implements OnInit {
  @Input() public event: LoadEventQuery['event'] | null = null;
  constructor() {}

  ngOnInit(): void {}
}
