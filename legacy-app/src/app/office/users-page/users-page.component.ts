import { Component, OnInit } from '@angular/core';
import { Student, UserService } from '../../shared/services/user.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent implements OnInit {
  users$: Observable<Student[]>;
  columns$;

  constructor(private userService: UserService, media: MediaObserver) {
    this.columns$ = media.asObservable().pipe(
      map(checks => !checks.filter(check => check.matches).find(match => match.mqAlias === 'gt-sm')),
      map(simple =>
        simple ? ['lastName', 'firstName', 'email'] : ['lastName', 'firstName', 'role', 'email', 'country']
      )
    );
  }

  ngOnInit() {
    this.users$ = this.userService.students.pipe(tap(console.log));
  }
}
