import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  MatListOption,
  MatSelectionList,
  MatSelectionListChange,
} from '@angular/material/list';
import { IFilterAngularComp } from 'ag-grid-angular';
import { IDoesFilterPassParams, IFilterParams } from 'ag-grid-community';

@Component({
  selector: 'app-grid-list-filter',
  standalone: true,
  imports: [MatListOption, MatSelectionList],
  templateUrl: './grid-list-filter.component.html',
  styleUrl: './grid-list-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridListFilterComponent implements IFilterAngularComp {
  params!: IFilterParams;
  protected choices = signal<{ value: string; label: string }[]>([]);
  private selectedOptions: string[] = [];
  public agInit(params: IFilterParams) {
    this.params = params;
    const choices = params.colDef.refData;
    if (choices) {
      this.choices.set(
        Object.entries(choices).map(([value, label]) => ({ value, label })),
      );
    }
  }
  public isFilterActive(): boolean {
    return true;
  }
  doesFilterPass(params: IDoesFilterPassParams): boolean {
    console.log(params);
    return true;
  }
  getModel(): any {
    if (this.selectedOptions.length)
      return { filter: this.selectedOptions, filterType: 'list', type: 'in' };
    this.params.api.destroyFilter(this.params.column);
    // return null;
  }
  setModel(model: any): void {
    console.log('setModel', model);
    return;
  }

  updateFilter(selection: MatSelectionListChange) {
    this.selectedOptions = selection.source.selectedOptions.selected.map(
      (option) => option.value,
    );
    this.params.filterChangedCallback();
  }
}
