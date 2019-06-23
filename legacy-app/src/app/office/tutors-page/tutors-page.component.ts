import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireFunctions } from '@angular/fire/functions';
import { CsvInputDialogComponent } from '../components/csv-input-dialog/csv-input-dialog.component';
import { Tutor, UserService } from '../../shared/services/user.service';
import { MediaObserver } from '@angular/flex-layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tutors-page',
  templateUrl: './tutors-page.component.html',
  styleUrls: ['./tutors-page.component.scss']
})
export class TutorsPageComponent implements OnInit {
  tutors$: Observable<Tutor[]>;
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
