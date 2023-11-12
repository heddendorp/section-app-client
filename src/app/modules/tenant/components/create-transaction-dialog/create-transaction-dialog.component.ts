import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  SearchUserForTransactionGQL,
  SearchUserForTransactionQuery,
  TransactionDirection,
  TransactionStatus,
  TransactionType,
} from '@tumi/legacy-app/generated/generated';
import { debounceTime, map, Observable, Subject, takeUntil } from 'rxjs';
import { AsyncPipe, NgFor } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-create-transaction-dialog',
  templateUrl: './create-transaction-dialog.component.html',
  styleUrls: ['./create-transaction-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatAutocompleteModule,
    NgFor,
    AsyncPipe,
  ],
})
export class CreateTransactionDialogComponent implements OnDestroy, OnInit {
  public transactionForm = new FormGroup({
    subject: new FormControl('', Validators.required),
    comment: new FormControl(''),
    direction: new FormControl(null, Validators.required),
    type: new FormControl(null, Validators.required),
    amount: new FormControl(null, Validators.required),
    status: new FormControl(TransactionStatus.Confirmed, Validators.required),
    userId: new FormControl(null),
  });
  public TransactionDirection = TransactionDirection;
  public TransactionStatus = TransactionStatus;
  public TransactionType = TransactionType;
  public searchUserControl = new FormControl();
  public userOptions$: Observable<SearchUserForTransactionQuery['users']>;
  private searchUserRef;
  private destroyed$ = new Subject();

  constructor(
    private searchUserForTransactionGQL: SearchUserForTransactionGQL,
  ) {
    this.searchUserRef = this.searchUserForTransactionGQL.watch();
    this.userOptions$ = this.searchUserRef.valueChanges.pipe(
      map((result) => result.data.users),
    );
  }

  onSubmit() {}

  ngOnInit() {
    this.searchUserControl.valueChanges
      .pipe(takeUntil(this.destroyed$), debounceTime(300))
      .subscribe((search) => {
        this.searchUserRef.refetch({
          search,
        });
      });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
