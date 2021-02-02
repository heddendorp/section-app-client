import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoneyRoutingModule } from './money-routing.module';
import { MoneyComponent } from './money.component';
import { NewTransactionDialogComponent } from './components/new-transaction-dialog/new-transaction-dialog.component';
import { SharedModule } from '@tumi/modules/shared';

@NgModule({
  declarations: [MoneyComponent, NewTransactionDialogComponent],
  imports: [CommonModule, MoneyRoutingModule, SharedModule, ScrollingModule],
})
export class MoneyModule {}
