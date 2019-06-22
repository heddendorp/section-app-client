import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Student } from '../../../shared/services/user.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-people-table',
  templateUrl: './people-table.component.html',
  styleUrls: ['./people-table.component.scss']
})
export class PeopleTableComponent implements OnInit, OnChanges {
  @Input() people: Student[];
  @Input() columns: string[];

  dataSource = new MatTableDataSource<Student>(this.people);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.people.firstChange && changes.people) {
      this.dataSource.data = changes.people.currentValue;
    }
  }
}
