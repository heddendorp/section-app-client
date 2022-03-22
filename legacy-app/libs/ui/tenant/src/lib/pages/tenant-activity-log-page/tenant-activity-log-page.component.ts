import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { GetLogsGQL, GetLogsQuery } from '@tumi/data-access';
import { Title } from '@angular/platform-browser';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ShowDataDialogComponent } from '../../components/show-data-dialog/show-data-dialog.component';

@Component({
  selector: 'tumi-tenant-activity-log-page',
  templateUrl: './tenant-activity-log-page.component.html',
  styleUrls: ['./tenant-activity-log-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantActivityLogPageComponent implements OnDestroy {
  public logs$: Observable<GetLogsQuery['logs']>;
  public stats$: Observable<GetLogsQuery['logStats']>;
  public displayedColumns = ['created', 'message', 'level', 'details'];
  private logsQueryRef;
  constructor(
    private title: Title,
    private loadLogQuery: GetLogsGQL,
    private dialog: MatDialog
  ) {
    this.title.setTitle('TUMi - manage registrations');
    this.logsQueryRef = this.loadLogQuery.watch();
    this.logsQueryRef.startPolling(5000);
    this.logs$ = this.logsQueryRef.valueChanges.pipe(
      map(({ data }) => data.logs)
    );
    this.stats$ = this.logsQueryRef.valueChanges.pipe(
      map(({ data }) => data.logStats)
    );
  }

  ngOnDestroy(): void  {
    this.logsQueryRef.stopPolling();
  }

  showDetails(log: GetLogsQuery['logs'][0]): void  {
    this.dialog.open(ShowDataDialogComponent, { data: log });
  }
}
