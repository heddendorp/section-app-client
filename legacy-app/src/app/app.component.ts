import { Component } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  interval,
  map,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { TraceClassDecorator } from '@sentry/angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
@TraceClassDecorator()
export class AppComponent {
  public appState: Observable<'ok' | 'down' | 'maintenance' | string>;
  public showNavigation$ = new BehaviorSubject(true);
  constructor(private http: HttpClient, private location: Location) {
    this.location.onUrlChange((url) => {
      if (url.includes('orders/labels')) {
        this.showNavigation$.next(false);
      } else if (url.includes('orders/receipts')) {
        this.showNavigation$.next(false);
      } else {
        this.showNavigation$.next(true);
      }
    });
    this.appState = interval(5000).pipe(
      switchMap(() => this.http.get<{ maintenance: boolean }>('/health')),
      catchError((e) => {
        console.log(e);
        return of({ maintenance: false });
      }),
      map((status) => {
        if (status.maintenance === true) {
          return 'maintenance';
        } else if (status.maintenance === false) {
          return 'down';
        } else {
          return 'ok';
        }
      }),
      startWith('ok')
    );
  }
}
