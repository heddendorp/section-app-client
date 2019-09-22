import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Student, UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-tutor-list-page',
  templateUrl: './tutor-list-page.component.html',
  styleUrls: ['./tutor-list-page.component.scss']
})
export class TutorListPageComponent implements OnInit {
  dataSource = new MatTableDataSource();
  displayedColumns = ['firstName', 'lastName', 'email', 'phone'];
  searchControl = new FormControl();

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.tutors.subscribe(data => (this.dataSource.data = data));
    this.searchControl.valueChanges.subscribe(value => (this.dataSource.filter = value));
    this.dataSource.sort = this.sort;
  }

  getId(index: number, student: Student): string {
    return student.id;
  }
}
