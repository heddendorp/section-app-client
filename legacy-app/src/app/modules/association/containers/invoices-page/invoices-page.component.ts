import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Invoice } from '@tumi/models/invoice';
import { InvoiceService } from '@tumi/services/invoice.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-invoices-page',
  templateUrl: './invoices-page.component.html',
  styleUrls: ['./invoices-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicesPageComponent implements OnInit {
  public invoices$: Observable<Invoice[]>;
  public displayedColumns = [
    'timestamp',
    'status',
    'description',
    'email',
    'amount',
  ];
  constructor(private invoices: InvoiceService) {}

  ngOnInit(): void {
    this.invoices$ = this.invoices.getAllInvoices();
  }
}
