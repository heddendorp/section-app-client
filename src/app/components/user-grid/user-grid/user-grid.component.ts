import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  input,
  Output,
} from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
  RowClickedEvent,
  SelectionColumnDef,
  themeQuartz,
} from 'ag-grid-community';
import { GridListFilterComponentComponent } from '@tumi/legacy-app/modules/tenant/pages/tenant-users-page/grid-list-filter-component/grid-list-filter-component.component';
import {
  ExportUsersCsvGQL,
  GetInitialUserGridDataGQL,
  GetUsersForUserGridGQL,
  GetEventsForUserGridGQL,
  MembershipStatus,
  Role,
} from '@tumi/legacy-app/generated/generated';
import {
  firstValueFrom,
  map,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  startWith,
} from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-grid',
  imports: [
    CommonModule,
    AgGridAngular,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-grid.component.html',
  styleUrl: './user-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserGridComponent {
  public height = input.required<string>();
  @Output() rowClicked = new EventEmitter<string>();
  @Output() selectionChangedIds = new EventEmitter<string[]>();
  private gridApi!: GridApi;
  protected theme = themeQuartz;
  public isExporting = false;

  // Event filter UI/state
  protected eventSearch = new FormControl<any>('');
  protected selectedEvent: { id: string; title: string } | null = null;

  // New AG Grid v33 Selection API configuration
  protected rowSelection: any = {
    mode: 'multiRow',
    selectAll: 'filtered',
  };

  private defaultCols: (ColDef | ColGroupDef)[] = [
    {
      headerName: 'First Name',
      field: 'firstName',
      filter: true,
      filterParams: {
        filterOptions: ['contains', 'equals'],
        maxNumConditions: 1,
      },
    },
    {
      headerName: 'Last Name',
      field: 'lastName',
      filter: true,
      filterParams: {
        filterOptions: ['contains', 'equals'],
        maxNumConditions: 1,
      },
    },
    {
      headerName: 'Registration date',
      field: 'joinedAt',
      cellDataType: 'date',
      sortable: false,
      filter: true,
      filterParams: {
        filterOptions: ['before', 'after', 'equals', 'inRange'],
        maxNumConditions: 1,
      },
      valueGetter: (params) => {
        return new Date(params.data?.joinedAt);
      },
    },
    {
      headerName: 'ESNcard valid until',
      field: 'esnCardValidUntil',
      cellDataType: 'date',
      sortable: false,
      filter: true,
      filterParams: {
        filterOptions: ['before', 'after', 'equals', 'inRange'],
        maxNumConditions: 1,
      },
      valueGetter: (params) => {
        return params.data?.esnCardValidUntil
          ? new Date(params.data.esnCardValidUntil)
          : null;
      },
    },
    {
      headerName: 'Last attended event',
      field: 'lastAttendedEvent',
      cellDataType: 'date',
      sortable: true,
      filter: true,
      filterParams: {
        filterOptions: ['before', 'after', 'equals', 'inRange'],
        maxNumConditions: 1,
      },
      valueGetter: (params) => {
        return params.data?.lastAttendedEvent
          ? new Date(params.data.lastAttendedEvent)
          : null;
      },
    },
    {
      headerName: 'E-Mail',
      field: 'email',
      filter: true,
      filterParams: {
        filterOptions: ['contains', 'equals'],
        maxNumConditions: 1,
      },
    },
    {
      headerName: 'Status',
      field: 'status',
      sortable: false,
      filter: GridListFilterComponentComponent,
      refData: Object.keys(MembershipStatus).reduce((acc, key) => {
        // @ts-ignore
        acc[MembershipStatus[key]] = key;
        return acc;
      }, {} as any),
    },
    {
      headerName: 'Role',
      field: 'role',
      sortable: false,
      filter: GridListFilterComponentComponent,
      refData: Object.keys(Role).reduce((acc, key) => {
        // @ts-ignore
        acc[Role[key]] = key;
        return acc;
      }, {} as any),
    },
  ];
  private getInitialUserGridDataGQL = inject(GetInitialUserGridDataGQL);
  private getUsersForUserGridGQL = inject(GetUsersForUserGridGQL);
  private getEventsForUserGridGQL = inject(GetEventsForUserGridGQL);
  private exportUsersCsvGQL = inject(ExportUsersCsvGQL);

  private readonly pastYearAfterISO = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    return d.toISOString();
  })();
  private readonly nowISO = new Date().toISOString();

  protected pastYearEvents = toSignal(
    this.eventSearch.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((search) => {
        const searchTerm =
          typeof search === 'string' ? search : (search?.title ?? '');
        return this.getEventsForUserGridGQL
          .fetch({
            after: this.pastYearAfterISO,
            before: this.nowISO,
            search: searchTerm || undefined,
            reverseOrder: true,
            limit: 50,
          })
          .pipe(map(({ data }) => data.events ?? []));
      }),
    ),
    { initialValue: [] as { id: string; title: string; start: string }[] },
  );

  protected dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      const { startRow, endRow, sortModel, filterModel } = params;
      firstValueFrom(
        this.getUsersForUserGridGQL.fetch(
          {
            startRow,
            endRow,
            sortModel,
            filterModel,
            eventId: this.selectedEvent?.id ?? undefined,
          },
          { fetchPolicy: 'network-only' },
        ),
      ).then((data) => {
        if (data.error) {
          params.failCallback();
          return;
        }
        params.successCallback(data.data.gridUsers, data.data.gridUsersCount);
      });
    },
  };

  protected onEventSelected(event: any) {
    const ev = event?.option?.value;
    if (ev?.id) {
      this.selectedEvent = { id: ev.id, title: ev.title };
      // reflect the selection in the input without triggering another fetch
      this.eventSearch.setValue(ev.title, { emitEvent: false });
      this.refreshGridForEventChange();
    }
  }

  protected displayEvent = (ev?: { id: string; title: string } | null) =>
    ev?.title ?? '';

  protected clearSelectedEvent() {
    if (this.selectedEvent) {
      this.selectedEvent = null;
      this.eventSearch.setValue('');
      this.refreshGridForEventChange();
    }
  }

  private refreshGridForEventChange() {
    if (!this.gridApi) return;
    this.gridApi.deselectAll();
    this.gridApi.purgeInfiniteCache();
  }

  // Public method to refresh the grid after external mutations (e.g., bulk status update)
  public refreshAfterMutation() {
    if (!this.gridApi) return;
    this.gridApi.deselectAll();
    this.gridApi.purgeInfiniteCache();
  }
  private tenantData = toSignal(
    this.getInitialUserGridDataGQL
      .fetch()
      .pipe(map(({ data }) => data.currentTenant)),
  );
  protected colDefs = computed(() => {
    const tenantData = this.tenantData();
    if (!tenantData) {
      return this.defaultCols;
    }
    const additionalDataGroup: ColGroupDef = {
      headerName: 'Additional Data',
      children: tenantData?.settings.userDataCollection.map((field) => {
        switch (field.type) {
          case 'select': {
            return {
              headerName: field.label,
              field: `additionalData.${field.label}`,
              sortable: false,
              filter: GridListFilterComponentComponent,
              refData: field.options.reduce((acc, key) => {
                acc[key] = key;
                return acc;
              }, {} as any),
            };
          }
          default: {
            return {
              headerName: field.label,
              field: `additionalData.${field.label}`,
              sortable: false,
            };
          }
        }
      }),
    };
    return [...this.defaultCols, additionalDataGroup];
  });

  public async exportData() {
    if (this.isExporting) {
      return; // Prevent multiple exports
    }

    // Get current filter and sort state from the grid
    const filterModel = this.gridApi.getFilterModel();
    const sortModel = this.gridApi
      .getColumnState()
      .filter((col) => col.sort)
      .map((col) => ({
        colId: col.colId!,
        sort: col.sort!,
      }));

    this.isExporting = true;

    try {
      const result = await firstValueFrom(
        this.exportUsersCsvGQL.fetch({
          filterModel,
          sortModel,
        }),
      );

      if (result.data?.exportUsersCSV) {
        // Decode base64 CSV content
        const csvContent = atob(result.data.exportUsersCSV);

        // Create a blob and download link
        const blob = new Blob([csvContent], {
          type: 'text/csv;charset=utf-8;',
        });
        const link = document.createElement('a');

        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute(
            'download',
            `users-export-${new Date().toISOString().split('T')[0]}.csv`,
          );
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }
    } catch (error) {
      console.error('Export failed:', error);
      // Could add user notification here
    } finally {
      this.isExporting = false;
    }
  }

  protected gridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  protected handleSelectionChanged() {
    if (!this.gridApi) return;
    const ids = this.gridApi
      .getSelectedRows()
      .map((r: any) => r?.id)
      .filter((id: any) => !!id);
    this.selectionChangedIds.emit(ids as string[]);
  }

  protected getRowId = (params: any) => params?.data?.id;

  protected handleRowClicked(rowClickedEvent: RowClickedEvent<{ id: string }>) {
    console.log(rowClickedEvent);
    // Prevent navigation when clicking on the selection checkbox cell or its cell area
    const nativeEvent = rowClickedEvent.event as MouseEvent | undefined;
    const target = nativeEvent?.target as HTMLElement | undefined;
    if (target) {
      // 1) Direct checkbox elements
      const clickedInSelection = !!target.closest(
        '.ag-selection-checkbox, .ag-checkbox-input-wrapper, .ag-checkbox-input, .ag-checkbox, input[type="checkbox"]',
      );
      if (clickedInSelection) return;

      // 2) Anywhere inside the selection column cell (even outside the checkbox element)
      const clickedCell = target.closest('.ag-cell') as HTMLElement | null;
      if (clickedCell) {
        const cellContainsSelection = !!clickedCell.querySelector(
          '.ag-selection-checkbox',
        );
        if (cellContainsSelection) return;
      }
    }

    if (rowClickedEvent.data?.id) this.rowClicked.emit(rowClickedEvent.data.id);
  }
}
