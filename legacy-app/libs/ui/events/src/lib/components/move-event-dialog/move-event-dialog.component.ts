import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  CreateMoveOrderGQL,
  LoadEventGQL,
  LoadEventQuery,
} from '@tumi/data-access';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Component({
  selector: 'tumi-move-event-dialog',
  templateUrl: './move-event-dialog.component.html',
  styleUrls: ['./move-event-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoveEventDialogComponent implements OnInit {
  public event$: Observable<LoadEventQuery['event']>;
  public buttonDisabled = new BehaviorSubject(false);
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { event: LoadEventQuery['event'] },
    private moveOrderGQL: CreateMoveOrderGQL,
    private loadEvent: LoadEventGQL
  ) {
    this.event$ = this.loadEvent
      .watch({ id: this.data.event?.id ?? '' })
      .valueChanges.pipe(map(({ data }) => data.event));
  }

  ngOnInit(): void {}

  async createOrder() {
    this.buttonDisabled.next(true);
    const event = await this.event$.pipe(first()).toPromise();
    if (event) {
      await this.moveOrderGQL
        .mutate({ eventId: event.registration?.id ?? '' })
        .toPromise();
    }
    this.buttonDisabled.next(false);
  }
}
