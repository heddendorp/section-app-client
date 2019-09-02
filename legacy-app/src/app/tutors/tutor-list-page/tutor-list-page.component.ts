import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Student, UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-tutor-list-page',
  templateUrl: './tutor-list-page.component.html',
  styleUrls: ['./tutor-list-page.component.scss']
})
export class TutorListPageComponent implements OnInit {
  tutors$: Observable<Student[]>;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.tutors$ = this.userService.tutors;
  }

  getId(index: number, student: Student): string {
    return student.id;
  }
}
