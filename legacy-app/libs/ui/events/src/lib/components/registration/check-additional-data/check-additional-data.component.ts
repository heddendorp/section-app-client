import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { LoadEventQuery } from '@tumi/data-access';

@Component({
  selector: 'tumi-check-additional-data',
  templateUrl: './check-additional-data.component.html',
  styleUrls: ['./check-additional-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckAdditionalDataComponent implements OnInit {
  @Input() public event: LoadEventQuery['event'] | null = null;
  constructor() {}

  ngOnInit(): void {}
}
