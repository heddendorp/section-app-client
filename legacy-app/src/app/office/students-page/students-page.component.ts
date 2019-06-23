import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CsvInputDialogComponent } from '../components/csv-input-dialog/csv-input-dialog.component';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { Student, UserService } from '../../shared/services/user.service';
import { MediaObserver } from '@angular/flex-layout';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-students-page',
  templateUrl: './students-page.component.html',
  styleUrls: ['./students-page.component.scss']
})
export class StudentsPageComponent implements OnInit {
  students$: Observable<Student[]>;
  displayedColumns: Observable<string[]>;

  constructor(
    private dialog: MatDialog,
    private functions: AngularFireFunctions,
    private userService: UserService,
    media: MediaObserver
  ) {
    this.displayedColumns = media.asObservable().pipe(
      map(checks => checks.filter(check => check.matches).find(match => match.mqAlias === 'gt-sm')),
      map(desktop =>
        desktop ? ['firstName', 'lastName', 'email', 'country', 'faculty'] : ['firstName', 'lastName', 'email']
      )
    );
  }

  ngOnInit() {
    this.students$ = this.userService.students;
  }

  collectCsvData() {
    this.dialog
      .open(CsvInputDialogComponent)
      .afterClosed()
      .subscribe(input => {
        this.functions
          .httpsCallable('replaceList')({ update: 'students', input })
          .subscribe(console.log);
      });
  }
}
