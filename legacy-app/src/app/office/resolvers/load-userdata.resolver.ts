import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { EventService, TumiEvent } from '../../shared/services/event.service';
import { Observable } from 'rxjs';
import { filter, first, tap } from 'rxjs/operators';
import { Student, UserService } from '../../shared/services/user.service';

@Injectable()
export class LoadUserdataResolver implements Resolve<Student> {
  constructor(private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Student> | Promise<Student> | Student {
    return this.userService.getFullDetails(route.paramMap.get('userId')).pipe(first());
  }
}
