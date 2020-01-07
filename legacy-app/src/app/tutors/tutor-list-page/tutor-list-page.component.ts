/*
 *     The TUMi app provides a modern way of managing events for an esn section.
 *     Copyright (C) 2020  Lukas Heddendorp
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
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
