import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { LoadProductGQL, LoadProductQuery, Role } from '@tumi/data-access';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { PhotoDetailsDialogComponent } from '@tumi/util-components';

@Component({
  selector: 'tumi-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent implements OnDestroy {
  public Role = Role;
  public product$: Observable<LoadProductQuery['product']>;
  public user$: Observable<LoadProductQuery['currentUser']>;
  private loadProductRef;
  private destroyed$ = new Subject();
  constructor(
    private route: ActivatedRoute,
    private loadProductGQL: LoadProductGQL,
    private dialog: MatDialog
  ) {
    this.loadProductRef = this.loadProductGQL.watch();
    this.product$ = this.loadProductRef.valueChanges.pipe(
      map(({ data }) => data.product)
    );
    this.user$ = this.loadProductRef.valueChanges.pipe(
      map(({ data }) => data.currentUser)
    );
    this.route.paramMap.pipe(takeUntil(this.destroyed$)).subscribe((params) => {
      this.loadProductRef.refetch({ id: params.get('productId') ?? '' });
    });
  }
  openPhoto(photo: unknown): void  {
    this.dialog.open(PhotoDetailsDialogComponent, {
      data: { photo },
      maxHeight: '95vh',
      maxWidth: '95vw',
      panelClass: 'photo-view',
    });
  }
  ngOnDestroy(): void  {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
