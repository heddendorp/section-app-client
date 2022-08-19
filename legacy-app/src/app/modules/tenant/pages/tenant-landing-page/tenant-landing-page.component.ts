import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-tenant-landing-page',
  templateUrl: './tenant-landing-page.component.html',
  styleUrls: ['./tenant-landing-page.component.scss'],
})
export class TenantLandingPageComponent {
  constructor(private title: Title) {
    this.title.setTitle('Management - TUMi');
  }
}
