import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';

const GET_EVENT_ID = gql`
  query GetEventId($id: ID!) {
    event(id: $id) {
      id
    }
  }
`;
@Injectable({
  providedIn: 'root',
})
export class CheckEventIdGuard implements CanActivate {
  constructor(private apollo: Apollo, private router: Router) {}
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    try {
      await firstValueFrom(
        this.apollo.query({
          query: GET_EVENT_ID,
          variables: { id: route.params['eventId'] },
        })
      );
    } catch (e) {
      return this.router.createUrlTree(
        ['/404'] /*{
        queryParams: { path: state.url },
      }*/
      );
    }
    return true;
  }
}
