import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-external-registration',
  templateUrl: './external-registration.component.html',
  styleUrls: ['./external-registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalRegistrationComponent {
  @Input() event: any;
}
