import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'tumi-tenant-products-page',
  templateUrl: './tenant-products-page.component.html',
  styleUrls: ['./tenant-products-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantProductsPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
