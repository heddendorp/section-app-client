import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { MatButtonModule } from '@angular/material/button';
import { UiAuthModule } from '@tumi/ui-auth';
import { UtilMaterialModule } from '@tumi/util/material';
import { ProductEditPageComponent } from './pages/product-edit-page/product-edit-page.component';
import { FlexModule } from '@angular/flex-layout';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: ProductListComponent },
      { path: ':productId', component: ProductDetailsComponent },
      { path: ':productId/edit', component: ProductEditPageComponent },
    ]),
    ReactiveFormsModule,
    UiAuthModule,
    UtilMaterialModule,
    MatButtonModule,
    FlexModule,
    MatProgressBarModule,
    MatInputModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatSelectModule,
  ],
  declarations: [
    ProductListComponent,
    ProductDetailsComponent,
    ProductEditPageComponent,
  ],
})
export class UiProductsModule {}
