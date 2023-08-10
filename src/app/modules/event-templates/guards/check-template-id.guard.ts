import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';

const GET_TEMPLATE_ID = gql`
  query GetTemplateId($id: ID!) {
    eventTemplate(id: $id) {
      id
    }
  }
`;
@Injectable({
  providedIn: 'root',
})
export class CheckTemplateIdGuard {
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
          query: GET_TEMPLATE_ID,
          variables: { id: route.params['templateId'] },
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
