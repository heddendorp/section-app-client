import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil, tap } from 'rxjs/operators';
import { Student, UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent implements OnInit, OnDestroy {
  users$: Observable<Student[]>;
  columns$;
  filterForm: FormGroup;
  destroyed$ = new Subject();
  filterIndeterminate = new BehaviorSubject(false);
  constructor(private userService: UserService, media: MediaObserver, private router: Router, fb: FormBuilder) {
    this.filterForm = fb.group({
      showAll: true,
      showStudents: true,
      showAdmins: true,
      showTutors: true
    });
    this.columns$ = media.asObservable().pipe(
      map(checks => !checks.filter(check => check.matches).find(match => match.mqAlias === 'gt-sm')),
      map(simple =>
        simple ? ['lastName', 'firstName', 'email'] : ['lastName', 'firstName', 'role', 'email', 'country']
      )
    );
  }

  ngOnInit() {
    this.users$ = combineLatest([
      this.filterForm.valueChanges.pipe(startWith(this.filterForm.value)),
      this.userService.students
    ]).pipe(
      map(([filter, students]) => {
        console.log(filter);
        return students.filter(student => {
          if (filter.showAll) {
            return true;
          }
          if (filter.showStudents && !student.isAdmin && !student.isTutor) {
            return true;
          }
          if (filter.showTutors && student.isTutor) {
            return true;
          }
          if (filter.showAdmins && student.isAdmin) {
            return true;
          }
          return false;
        });
      })
    );
    this.filterForm.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(value => {
      if (value.showStudents && value.showTutors && value.showAdmins) {
        this.filterForm.get('showAll').setValue(true, { emitEvent: false });
        this.filterIndeterminate.next(false);
      } else if (!value.showStudents && !value.showTutors && !value.showAdmins) {
        this.filterForm.get('showAll').setValue(false, { emitEvent: false });
        this.filterIndeterminate.next(false);
      } else {
        this.filterForm.get('showAll').setValue(false, { emitEvent: false });
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

  ngOnDestroy(): void {
    this.destroyed$.complete();
  }

  showUser(id) {
    this.router.navigate(['office', 'users', id]);
  }
}
