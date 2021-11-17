import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { MatButtonModule } from '@angular/material/button';
import { UiAuthModule } from '@tumi/ui-auth';
import { UtilMaterialModule } from '@tumi/util/material';
import { ProductEditPageComponent } from './pages/product-edit-page/product-edit-page.component';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { UtilComponentsModule } from '@tumi/util-components';
import { MatCardModule } from '@angular/material/card';
import { MarkdownModule } from 'ngx-markdown';
import { OrderProductComponent } from './components/order-product/order-product.component';
import { MatListModule } from '@angular/material/list';
import { OrdersPageComponent } from './pages/orders-page/orders-page.component';
import { ShippingLabelsPageComponent } from './pages/shipping-labels-page/shipping-labels-page.component';
import { PrintReceiptsPageComponent } from './pages/print-receipts-page/print-receipts-page.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: ProductListComponent },
      { path: 'orders', component: OrdersPageComponent },
      { path: 'orders/labels', component: ShippingLabelsPageComponent },
      { path: 'orders/receipts', component: PrintReceiptsPageComponent },
      { path: ':productId', component: ProductDetailsComponent },
      { path: ':productId/edit', component: ProductEditPageComponent },
    ]),
    ReactiveFormsModule,
    UiAuthModule,
    UtilMaterialModule,
    UtilComponentsModule,
    MatButtonModule,
    FlexModule,
    MatProgressBarModule,
    MatInputModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatSelectModule,
    MatCardModule,
    MarkdownModule,
    FlexLayoutModule,
    MatListModule,
  ],
  declarations: [
    ProductListComponent,
    ProductDetailsComponent,
    ProductEditPageComponent,
    OrderProductComponent,
    OrdersPageComponent,
    ShippingLabelsPageComponent,
    PrintReceiptsPageComponent,
  ],
})
export class UiProductsModule {}
