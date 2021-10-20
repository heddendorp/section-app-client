import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
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
  constructor(private http: HttpClient) {
    this.appState = interval(5000).pipe(
      switchMap(() => this.http.get<{ maintenance: boolean }>('/health')),
      catchError(() => of({ maintenance: false })),
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
