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
  filterForm: FormGroup;
  searchControl = new FormControl('');
  filterIndeterminate = new BehaviorSubject(false);

  dataSource = new MatTableDataSource<Student>(this.people);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(fb: FormBuilder) {
    this.filterForm = fb.group({
      showAll: true,
      showStudents: true,
      showAdmins: true,
      showTutors: true
    });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(value => (this.dataSource.filter = value));
    this.filterForm.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(value => {
      if (value.showStudents && value.showTutors && value.showAdmins) {
        this.filterForm.get('showAll').setValue(true, { emitEvent: false });
        this.filterIndeterminate.next(false);
      } else if (!value.showStudents && !value.showTutors && !value.showAdmins) {
        this.filterForm.get('showAll').setValue(false, { emitEvent: false });
        this.filterIndeterminate.next(false);
      } else {
        this.filterIndeterminate.next(true);
      }
    });
    this.filterForm
      .get('showAll')
      .valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe(value => {
        if (value) {
          this.filterForm.setValue(
            {
              showAll: true,
              showStudents: true,
              showAdmins: true,
              showTutors: true
            },
            { emitEvent: false }
          );
        } else {
          this.filterForm.setValue(
            {
              showAll: false,
              showStudents: false,
              showAdmins: false,
              showTutors: false
            },
            { emitEvent: false }
          );
        }
        this.filterIndeterminate.next(false);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.people && !changes.people.firstChange) {
      this.dataSource.data = changes.people.currentValue;
      this.filterForm.reset({
        showAll: true,
        showStudents: true,
        showAdmins: true,
        showTutors: true
      });
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.complete();
  }

  resolveFaculty(key: string) {
    return getFaculty(key);
  }
}
