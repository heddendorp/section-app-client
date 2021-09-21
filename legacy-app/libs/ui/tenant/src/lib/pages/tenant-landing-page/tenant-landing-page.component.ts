import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'tumi-tenant-landing-page',
  templateUrl: './tenant-landing-page.component.html',
  styleUrls: ['./tenant-landing-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantLandingPageComponent implements OnInit {
  constructor(private title: Title) {
    this.title.setTitle('TUMi - manage');
  }

  ngOnInit(): void {}
}
