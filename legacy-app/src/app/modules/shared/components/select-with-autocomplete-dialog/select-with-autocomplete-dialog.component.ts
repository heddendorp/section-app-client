import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { map, Observable, startWith, Subject, tap } from 'rxjs';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent } from '@angular/material/legacy-autocomplete';

export interface SelectWithAutocompleteDialogData {
  choices: Required<{ id: string; [displayAttribute: string]: string }>[];
  displayAttribute: string;
  title: string;
}

@Component({
  selector: 'app-select-with-autocomplete-dialog',
  templateUrl: './select-with-autocomplete-dialog.component.html',
  styleUrls: ['./select-with-autocomplete-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectWithAutocompleteDialogComponent {
  public nameControl = new UntypedFormControl();
  public filteredChoices$: Observable<
    Required<{ id: string; [displayAttribute: string]: string }>[]
  >;
  private destroyed$ = new Subject();
  private idTest = new RegExp(
    /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  );

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: SelectWithAutocompleteDialogData,
    private dialog: MatDialogRef<SelectWithAutocompleteDialogComponent>
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
        return this.data.choices.filter((item) =>
          item[data.displayAttribute]
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase())
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
