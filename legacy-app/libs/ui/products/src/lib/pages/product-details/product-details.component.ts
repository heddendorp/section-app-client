import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { LoadProductGQL, LoadProductQuery, Role } from '@tumi/data-access';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tumi-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent implements OnDestroy {
  public Role = Role;
  public product$: Observable<LoadProductQuery['product']>;
  private loadProductRef;
  private destroyed$ = new Subject();
  constructor(
    private route: ActivatedRoute,
    private loadProductGQL: LoadProductGQL
  ) {
    this.loadProductRef = this.loadProductGQL.watch();
    this.product$ = this.loadProductRef.valueChanges.pipe(
      map(({ data }) => data.product)
    );
    this.route.paramMap.pipe(takeUntil(this.destroyed$)).subscribe((params) => {
      this.loadProductRef.refetch({ id: params.get('productId') ?? '' });
    });
  }
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
