import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-csv-input-dialog',
  templateUrl: './csv-input-dialog.component.html',
  styleUrls: ['./csv-input-dialog.component.scss']
})
export class CsvInputDialogComponent implements OnInit {
  dataInput = new FormControl('', Validators.required);

  constructor(private dialog: MatDialogRef<CsvInputDialogComponent>) {}

  ngOnInit() {}

  importData() {
    this.dialog.close(this.dataInput.value);
  }
}
