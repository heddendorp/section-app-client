import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { User } from '@tumi/models';
import { Invoice } from '@tumi/models/invoice';

@Component({
  selector: 'app-member-invoice-info',
  templateUrl: './member-invoice-info.component.html',
  styleUrls: ['./member-invoice-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberInvoiceInfoComponent implements OnInit {
  @Input() invoices: Invoice[];
  @Input() user: User;
  @Output() sendInvoice = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
}
