import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { NewMemberApplication } from '@tumi/models';
import { FullMemberApplication } from '@tumi/models/fullMemberApplication';
import { ApplicationService } from '@tumi/services/application.service';
import { Observable, of } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FullMemberApplicationResolver
  implements Resolve<FullMemberApplication> {
  constructor(private applications: ApplicationService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<FullMemberApplication> {
    return this.applications
      .getOneFullMember(route.paramMap.get('applicationId') as string)
      .pipe(first());
  }
}
