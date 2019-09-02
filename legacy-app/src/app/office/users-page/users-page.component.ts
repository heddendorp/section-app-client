import { Component, OnInit } from '@angular/core';
import { Student, UserService } from '../../shared/services/user.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent implements OnInit {
  users$: Observable<Student[]>;
  columns$ = new BehaviorSubject(['email', 'faculty']);

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.users$ = this.userService.students.pipe(tap(console.log));
  }
}
