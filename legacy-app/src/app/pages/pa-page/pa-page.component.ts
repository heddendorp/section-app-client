import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pa-page',
  templateUrl: './pa-page.component.html',
  styleUrls: ['./pa-page.component.scss']
})
export class PaPageComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  trackClick() {
    // @ts-ignore
    gtag('event', 'pa-link');
  }
}
