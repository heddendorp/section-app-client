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
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Subject } from 'rxjs';
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
