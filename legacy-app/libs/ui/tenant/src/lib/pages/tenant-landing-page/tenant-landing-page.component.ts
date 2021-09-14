import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'tumi-tenant-landing-page',
  templateUrl: './tenant-landing-page.component.html',
  styleUrls: ['./tenant-landing-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantLandingPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
