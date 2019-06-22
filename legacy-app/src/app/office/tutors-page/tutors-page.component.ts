import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireFunctions } from '@angular/fire/functions';
import { CsvInputDialogComponent } from '../components/csv-input-dialog/csv-input-dialog.component';
import { Tutor, UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-tutors-page',
  templateUrl: './tutors-page.component.html',
  styleUrls: ['./tutors-page.component.scss']
})
export class TutorsPageComponent implements OnInit {
  tutors$: Observable<Tutor[]>;
  displayColumns = ['firstName', 'lastName', 'email'];

  constructor(private dialog: MatDialog, private functions: AngularFireFunctions, private userService: UserService) {}

  ngOnInit() {
    this.tutors$ = this.userService.tutors;
  }

  collectCsvData() {
    this.dialog
      .open(CsvInputDialogComponent)
      .afterClosed()
      .subscribe(input => {
        this.functions
          .httpsCallable('replaceList')({ update: 'tutors', input })
          .subscribe(console.log);
      });
  }
}
