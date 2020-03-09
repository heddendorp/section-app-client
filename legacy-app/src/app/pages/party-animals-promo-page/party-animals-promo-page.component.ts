import { Component, OnInit } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'app-party-animals-promo-page',
  templateUrl: './party-animals-promo-page.component.html',
  styleUrls: ['./party-animals-promo-page.component.scss']
})
export class PartyAnimalsPromoPageComponent implements OnInit {

  constructor(public analytics: AngularFireAnalytics) {
  }

  ngOnInit(): void {
    this.analytics.logEvent('pa_visit');
  }

}
