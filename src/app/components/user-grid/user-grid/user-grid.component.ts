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
} from 'ag-grid-community';
import { GridListFilterComponentComponent } from '@tumi/legacy-app/modules/tenant/pages/tenant-users-page/grid-list-filter-component/grid-list-filter-component.component';
import {
  GetInitialUserGridDataGQL,
  GetUsersForUserGridGQL,
  MembershipStatus,
  Role,
} from '@tumi/legacy-app/generated/generated';
import { firstValueFrom, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-grid',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './user-grid.component.html',
  styleUrl: './user-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserGridComponent {
  public height = input.required<string>();
  @Output() rowClicked = new EventEmitter<string>();
  private gridApi!: GridApi;
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
  protected dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      console.log(params);
      const { startRow, endRow, sortModel, filterModel } = params;
      firstValueFrom(
        this.getUsersForUserGridGQL.fetch({
          startRow,
          endRow,
          sortModel,
          filterModel,
        }),
      ).then((data) => {
        if (data.error) {
          params.failCallback();
        }
        params.successCallback(data.data.gridUsers, data.data.gridUsersCount);
      });
    },
  };
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

  public exportData() {
    const cacheBlockSize = this.gridApi.getGridOption('cacheBlockSize');
    const lastRow = this.gridApi.paginationGetRowCount();
    if (!cacheBlockSize || cacheBlockSize < lastRow) {
      this.gridApi.setGridOption('cacheBlockSize', lastRow);
      const doExport = ({ api }: { api: GridApi }) => {
        setTimeout(() => {
          api.exportDataAsCsv();
          api.setGridOption('cacheBlockSize', cacheBlockSize);
          api.removeEventListener('paginationChanged', doExport);
        }, 100);
      };
      this.gridApi.addEventListener('paginationChanged', doExport);
    } else {
      this.gridApi.exportDataAsCsv();
    }
  }

  protected gridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  protected handleRowClicked(rowClickedEvent: RowClickedEvent<{ id: string }>) {
    if (rowClickedEvent.data?.id) this.rowClicked.emit(rowClickedEvent.data.id);
  }
}
