import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'tumi-tenant-user-info-page',
  templateUrl: './tenant-user-info-page.component.html',
  styleUrls: ['./tenant-user-info-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantUserInfoPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
