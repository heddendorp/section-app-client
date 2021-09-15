import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { LoadEventQuery, Role } from '@tumi/data-access';

@Component({
  selector: 'tumi-event-header',
  templateUrl: './event-header.component.html',
  styleUrls: ['./event-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventHeaderComponent implements OnInit {
  public Role = Role;
  @Input() public event: LoadEventQuery['event'] | null = null;
  constructor() {}

  ngOnInit(): void {}
}
