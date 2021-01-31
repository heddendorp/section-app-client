import { Injectable } from '@angular/core';
import algoliasearch from 'algoliasearch/lite';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private index;
  constructor() {
    const client = algoliasearch(
      'BH6YF10GXD',
      'eb2ce6b5fefdf61eb38eb8f8900fd4a7'
    );
    this.index = client.initIndex('users');
  }

  public find(query: string) {
    return fromPromise(
      this.index.search<{
        firstName: string;
        lastName: string;
        email: string;
        id: string;
      }>(query, {
        attributesToRetrieve: ['firstName', 'lastName', 'email', 'id'],
        hitsPerPage: 150,
      })
    );
  }
}
