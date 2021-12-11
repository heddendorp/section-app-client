import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import {
  BehaviorSubject,
  catchError,
  interval,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tumi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public appState: Observable<'ok' | 'down' | 'maintenance' | string>;
  public showNavigation$ = new BehaviorSubject(true);
  constructor(private http: HttpClient, private location: Location) {
    this.location.onUrlChange((url) => {
      if (url.includes('orders/labels')) {
        this.showNavigation$.next(false);
      } else if (url.includes('orders/receipts')) {
        this.showNavigation$.next(false);
      } else if (url.includes('/home')) {
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
