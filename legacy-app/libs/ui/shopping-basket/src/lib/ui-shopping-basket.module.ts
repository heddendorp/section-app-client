import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BasketOverviewPageComponent } from './pages/basket-overview-page/basket-overview-page.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UtilMaterialModule } from '@tumi/util/material';
import { MatButtonModule } from '@angular/material/button';
import { PurchasesPageComponent } from './pages/purchases-page/purchases-page.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: BasketOverviewPageComponent },
      { path: 'purchases', component: PurchasesPageComponent },
    ]),
    MatProgressBarModule,
    MatListModule,
    FlexLayoutModule,
    UtilMaterialModule,
    MatButtonModule,
  ],
  declarations: [BasketOverviewPageComponent, PurchasesPageComponent],
})
export class UiShoppingBasketModule {}
