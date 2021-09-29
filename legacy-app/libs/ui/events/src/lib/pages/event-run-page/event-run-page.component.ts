import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import {
  LoadEventForRunningGQL,
  LoadEventForRunningQuery,
} from '@tumi/data-access';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ScanningDialogComponent } from '../../components/running/scanning-dialog/scanning-dialog.component';

@Component({
  selector: 'tumi-event-run-page',
  templateUrl: './event-run-page.component.html',
  styleUrls: ['./event-run-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventRunPageComponent implements OnDestroy {
  public event$: Observable<LoadEventForRunningQuery['event']>;
  private loadEventQueryRef;
  private destroyed$ = new Subject();
  constructor(
    private title: Title,
    private loadEvent: LoadEventForRunningGQL,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.title.setTitle('TUMi - run event');
    this.loadEventQueryRef = this.loadEvent.watch();
    this.route.paramMap.subscribe((params) =>
      this.loadEventQueryRef.refetch({ id: params.get('eventId') ?? '' })
    );
    this.event$ = this.loadEventQueryRef.valueChanges.pipe(
      map(({ data }) => data.event)
    );
    this.loadEventQueryRef.startPolling(5000);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    this.loadEventQueryRef.stopPolling();
  }

  scanCode() {
    this.dialog.open(ScanningDialogComponent, {
      width: '95vw',
      height: '95vh',
    });
  }
}
