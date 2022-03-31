import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShoppingBasketRoutingModule } from './shopping-basket-routing.module';
import { ShoppingBasketComponent } from './shopping-basket.component';


@NgModule({
  declarations: [
    ShoppingBasketComponent
  ],
  imports: [
    CommonModule,
    ShoppingBasketRoutingModule
  ]
})
export class ShoppingBasketModule { }
