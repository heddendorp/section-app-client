import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CreateProductGQL,
  GetProductListGQL,
  GetProductListQuery,
  Role,
} from '@tumi/data-access';
import { Router } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'tumi-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  public Role = Role;
  public products$: Observable<GetProductListQuery['products']>;
  private productListRef;
  constructor(
    private router: Router,
    private getProductListGQL: GetProductListGQL,
    private createProductGQL: CreateProductGQL,
    private title: Title
  ) {
    this.title.setTitle('TUMi - shop');
    this.productListRef = this.getProductListGQL.watch();
    this.products$ = this.productListRef.valueChanges.pipe(
      map(({ data }) => data.products)
    );
  }
  async createProduct() {
    const res = await firstValueFrom(this.createProductGQL.mutate());
    if (res.data?.createProduct) {
      await this.router.navigate(['shop', res.data.createProduct.id, 'edit']);
    }
  }
}
