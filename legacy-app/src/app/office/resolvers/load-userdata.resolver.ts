import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Student, UserService } from '../../shared/services/user.service';

@Injectable()
export class LoadUserdataResolver implements Resolve<Student> {
  constructor(private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Student> | Promise<Student> | Student {
    return this.userService.getFullDetails(route.paramMap.get('userId')).pipe(first());
  }
}
