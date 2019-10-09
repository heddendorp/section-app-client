/*
 *     The TUMi app provides a modern way of managing events for an esn section.
 *     Copyright (C) 2019  Lukas Heddendorp
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

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Student } from '../../../shared/services/user.service';
import { getFaculty } from '../../../shared/uni-data';

@Component({
  selector: 'app-people-table',
  templateUrl: './people-table.component.html',
  styleUrls: ['./people-table.component.scss']
})
export class PeopleTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() people: Student[];
  @Input() columns: string[];
  @Output() show = new EventEmitter();
  destroyed$ = new Subject();

  searchControl = new FormControl('');

  dataSource = new MatTableDataSource<Student>(this.people);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(value => (this.dataSource.filter = value));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.people && !changes.people.firstChange) {
      this.dataSource.data = changes.people.currentValue;
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.complete();
  }

  resolveFaculty(key: string) {
    return getFaculty(key);
  }
}
