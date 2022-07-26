import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
} from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, Observable, startWith, Subject, tap } from 'rxjs';
import { LoadUsersByStatusQuery } from '@tumi/legacy-app/generated/generated';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-select-organizer-dialog',
  templateUrl: './select-organizer-dialog.component.html',
  styleUrls: ['./select-organizer-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectOrganizerDialogComponent implements OnDestroy {
  public nameControl = new UntypedFormControl();
  public filteredChoices$: Observable<LoadUsersByStatusQuery['users']>;
  private destroyed$ = new Subject();
  private idTest = new RegExp(
    /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  );

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { choices: LoadUsersByStatusQuery['users'] },
    private dialog: MatDialogRef<SelectOrganizerDialogComponent>
  ) {
    this.filteredChoices$ = this.nameControl.valueChanges.pipe(
      startWith(''),
      tap((search) => {
        if (this.idTest.test(search)) {
          this.dialog.close(search);
        }
      }),
      map((search: string) => {
        if (!search) {
          return this.data.choices;
        }
        return this.data.choices.filter((user) =>
          user.fullName.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  selectUser(ev: MatAutocompleteSelectedEvent): void {
    this.dialog.close(ev.option.value);
  }
}
