import { Component, Input } from '@angular/core';
import { PriceModel } from '../finance-planner.component';
import { CurrencyPipe, PercentPipe } from '@angular/common';

@Component({
  selector: 'app-finance-planner-price-model',
  templateUrl: './finance-planner-price-model.component.html',
  styleUrls: ['./finance-planner-price-model.component.scss'],
  standalone: true,
  imports: [PercentPipe, CurrencyPipe],
})
export class FinancePlannerPriceModelComponent {
  @Input() name: string = '';
  @Input()
  result!: PriceModel;
}
