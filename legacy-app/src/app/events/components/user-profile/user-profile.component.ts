import { Component, Input, OnInit } from '@angular/core';
import { Student } from '../../../shared/services/user.service';
import { getFaculty, getTarget, getType } from '../../../shared/uni-data';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  @Input() user: Student;

  constructor() {}

  ngOnInit() {}

  getFaculty(key) {
    return getFaculty(key);
  }

  getType(key) {
    return getType(key);
  }

  getTarget(key) {
    return getTarget(key);
  }
}
