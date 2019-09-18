import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { Student, UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-tutor-list-page',
  templateUrl: './tutor-list-page.component.html',
  styleUrls: ['./tutor-list-page.component.scss']
})
export class TutorListPageComponent implements OnInit {
  dataSource = new MatTableDataSource();
  displayedColumns = ['name', 'email', 'phone'];
  searchControl = new FormControl();

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.tutors.subscribe(data => (this.dataSource.data = data));
    this.searchControl.valueChanges.subscribe(value => (this.dataSource.filter = value));
  }

  getId(index: number, student: Student): string {
    return student.id;
  }
}
