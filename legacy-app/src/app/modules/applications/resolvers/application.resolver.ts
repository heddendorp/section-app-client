import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Application } from '@tumi/models';
import { ApplicationService } from '@tumi/services/application.service';
import { Observable, of } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApplicationResolver implements Resolve<Application> {
  constructor(private applications: ApplicationService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Application> {
    return this.applications
      .getOne(route.paramMap.get('applicationId') as string)
      .pipe(first());
  }
}
