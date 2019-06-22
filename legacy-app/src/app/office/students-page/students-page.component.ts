import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CsvInputDialogComponent } from '../components/csv-input-dialog/csv-input-dialog.component';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { Student, UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-students-page',
  templateUrl: './students-page.component.html',
  styleUrls: ['./students-page.component.scss']
})
export class StudentsPageComponent implements OnInit {
  students$: Observable<Student[]>;
  displayColumns = ['firstName', 'lastName', 'email', 'country', 'faculty'];

  constructor(private dialog: MatDialog, private functions: AngularFireFunctions, private userService: UserService) {}

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
