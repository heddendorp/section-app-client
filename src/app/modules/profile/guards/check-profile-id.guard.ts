import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';

const GET_PROFILE_ID = gql`
  query GetProfileId($id: ID!) {
    user(id: $id) {
      id
    }
  }
`;
@Injectable({
  providedIn: 'root',
})
export class CheckProfileIdGuard {
  constructor(
    private apollo: Apollo,
    private router: Router,
  ) {}
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean | UrlTree> {
    try {
      await firstValueFrom(
        this.apollo.query({
          query: GET_PROFILE_ID,
          variables: { id: route.params['userId'] },
        }),
      );
    } catch (e) {
      return this.router.createUrlTree(
        ['/404'] /*{
        queryParams: { path: state.url },
      }*/,
      );
    }
    return true;
  }
}
