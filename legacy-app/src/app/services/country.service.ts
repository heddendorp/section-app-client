import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  constructor(private http: HttpClient) {}

  public getName(code: string): Observable<string> {
    return this.http
      .get<{ name: string }>(
        `https://restcountries.eu/rest/v2/alpha/${code}?fields=name`
      )
      .pipe(map(({ name }) => name));
  }

  public getAll(): Observable<any[]> {
    return this.http.get<any[]>(
      'https://restcountries.eu/rest/v2/all?fields=name;alpha2Code'
    );
  }
}
