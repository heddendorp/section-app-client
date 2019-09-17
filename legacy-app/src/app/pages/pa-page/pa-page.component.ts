import { Component, OnInit } from '@angular/core';
import { sendEvent } from '../../shared/utility-functions';

@Component({
  selector: 'app-pa-page',
  templateUrl: './pa-page.component.html',
  styleUrls: ['./pa-page.component.scss']
})
export class PaPageComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  trackClick() {
    sendEvent('pa-link');
    sendEvent('visit_pa_signup');
  }
}
