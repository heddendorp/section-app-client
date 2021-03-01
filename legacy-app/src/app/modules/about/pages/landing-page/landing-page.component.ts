import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent implements OnInit {
  images$: Observable<any[]>;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.images$ = this.http.get<any[]>('/assets/images/landing/info.json');
  }
}
