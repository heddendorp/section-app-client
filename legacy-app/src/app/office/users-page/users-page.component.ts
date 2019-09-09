import { Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Student, UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent implements OnInit {
  users$: Observable<Student[]>;
  columns$;

  constructor(private userService: UserService, media: MediaObserver, private router: Router) {
    this.columns$ = media.asObservable().pipe(
      map(checks => !checks.filter(check => check.matches).find(match => match.mqAlias === 'gt-sm')),
      map(simple =>
        simple ? ['lastName', 'firstName', 'email'] : ['lastName', 'firstName', 'role', 'email', 'country']
      )
    );
  }

  ngOnInit() {
    this.users$ = this.userService.students;
  }

  showUser(id) {
    this.router.navigate(['office', 'users', id]);
  }
}
