import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShowDataDialogComponent } from '@tumi/legacy-app/modules/tenant/components/show-data-dialog/show-data-dialog.component';
import { GetLogsGQL, GetLogsQuery } from '@tumi/legacy-app/generated/generated';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-tenant-activity-log-page',
  templateUrl: './tenant-activity-log-page.component.html',
  styleUrls: ['./tenant-activity-log-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantActivityLogPageComponent implements OnDestroy {
  public logs$: Observable<GetLogsQuery['logs']>;
  public stats$: Observable<GetLogsQuery['logStats']>;
  public displayedColumns = ['created', 'message', 'level', 'details'];
  private logsQueryRef;

  constructor(private loadLogQuery: GetLogsGQL, private dialog: MatDialog) {
    this.logsQueryRef = this.loadLogQuery.watch();
    this.logsQueryRef.startPolling(5000);
    this.logs$ = this.logsQueryRef.valueChanges.pipe(
      map(({ data }) => data.logs)
    );
    this.stats$ = this.logsQueryRef.valueChanges.pipe(
      map(({ data }) => data.logStats)
    );
  }

  ngOnDestroy(): void {
    this.logsQueryRef.stopPolling();
  }

  showDetails(log: GetLogsQuery['logs'][0]): void {
    this.dialog.open(ShowDataDialogComponent, {
      data: log,
      panelClass: 'modern',
    });
  }
}
