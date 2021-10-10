import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { GetLogsGQL, GetLogsQuery } from '@tumi/data-access';
import { Title } from '@angular/platform-browser';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tumi-tenant-activity-log-page',
  templateUrl: './tenant-activity-log-page.component.html',
  styleUrls: ['./tenant-activity-log-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantActivityLogPageComponent implements OnDestroy {
  public logs$: Observable<GetLogsQuery['logs']>;
  public displayedColumns = ['created', 'message', 'level'];
  private logsQueryRef;
  constructor(private title: Title, private loadLogQuery: GetLogsGQL) {
    this.title.setTitle('TUMi - manage registrations');
    this.logsQueryRef = this.loadLogQuery.watch();
    this.logsQueryRef.startPolling(5000);
    this.logs$ = this.logsQueryRef.valueChanges.pipe(
      map(({ data }) => data.logs)
    );
  }

  ngOnDestroy() {
    this.logsQueryRef.stopPolling();
  }
}
