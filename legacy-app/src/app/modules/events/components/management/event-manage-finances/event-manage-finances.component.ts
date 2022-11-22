import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  GetCostItemsForEventGQL,
  GetCostItemsForEventQuery,
  UpdateCostItemsFromTemplateGQL,
} from '@tumi/legacy-app/generated/generated';
import { firstValueFrom, map, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-event-manage-finances',
  templateUrl: './event-manage-finances.component.html',
  styleUrls: ['./event-manage-finances.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventManageFinancesComponent implements OnChanges {
  @Input() public eventId: string | undefined;
  public data$: Observable<GetCostItemsForEventQuery>;
  private getDataQueryRef;
  constructor(
    private getCostItems: GetCostItemsForEventGQL,
    private updateCostItems: UpdateCostItemsFromTemplateGQL,
    private snackbar: MatSnackBar
  ) {
    this.getDataQueryRef = this.getCostItems.watch();
    this.data$ = this.getDataQueryRef.valueChanges.pipe(
      map(({ data }) => data)
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventId']) {
      this.getDataQueryRef.refetch({
        eventId: changes['eventId'].currentValue,
      });
    }
  }

  async getFromTemplate() {
    const { event } = await firstValueFrom(this.data$);
    if (event) {
      try {
        await this.updateCostItems.mutate({ eventId: event.id }).toPromise();
        await this.getDataQueryRef.refetch();
      } catch (e: unknown) {
        console.log(e);
        if (e instanceof Error) {
          this.snackbar.open(e.message, 'OK', { duration: 5000 });
        }
      }
    }
  }

  async removeCostItem() {}

  async updateCostItem() {}
}
