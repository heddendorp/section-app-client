import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewFinanceEntryDialogComponent } from '../new-finance-entry-dialog/new-finance-entry-dialog.component';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, map } from 'rxjs/operators';
import { GetEventTemplateQuery, UpdateFinancesGQL } from '@tumi/data-access';

interface CostItem {
  description: string;
  value: number;
  type: string;
  prepaid: boolean;
  details: string;
  scale?: number;
}

@Component({
  selector: 'tumi-finance-planner',
  templateUrl: './finance-planner.component.html',
  styleUrls: ['./finance-planner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancePlannerComponent implements OnChanges {
  @Input() public template: GetEventTemplateQuery['eventTemplate'] | undefined;
  public displayedColumns = ['description', 'value', 'scale', 'prepaid'];
  public items$ = new ReplaySubject<CostItem[]>(1);
  public forecastForm: FormGroup;
  public forecastResult$: Observable<any>;
  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private updateFinances: UpdateFinancesGQL
  ) {
    this.forecastForm = this.fb.group({
      organizers: [0, Validators.required],
      participants: [0, Validators.required],
      days: [1, Validators.required],
    });
    this.forecastResult$ = combineLatest([
      this.items$,
      this.forecastForm.valueChanges,
    ]).pipe(
      map(([items, info]) => {
        const totalCost = this.getTotalCost([items, info]);
        const maxSubsidies =
          info.participants *
          Math.min(totalCost / info.participants / 3, 20 * info.days);
        const minPrice = (totalCost - maxSubsidies) / info.participants;
        const recommendedPrice = Math.ceil(minPrice * 1.04);
        const expectedFee =
          (0.25 + recommendedPrice * 0.015) * info.participants;
        return {
          totalCost,
          maxSubsidies,
          minPrice,
          recommendedPrice,
          expectedFee,
        };
      })
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.template && changes.template.firstChange) {
      this.items$.next(changes.template.currentValue.finances.items);
    }
  }

  private getTotalCost([items, info]: [
    CostItem[],
    { participants: number; organizers: number }
  ]) {
    return items
      .map((item) => {
        switch (item.type) {
          case 'event':
            return item.value;
          case 'participant':
            return item.value * (info.participants + info.organizers);
          default:
            return (
              item.value *
              Math.ceil(
                (info.participants + info.organizers) / (item.scale ?? 1)
              )
            );
        }
      })
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  }
  async addItem() {
    const newItem = await this.dialog
      .open(NewFinanceEntryDialogComponent)
      .afterClosed()
      .toPromise();
    if (newItem) {
      const items = await this.items$.pipe(first()).toPromise();
      this.items$.next([...items, newItem]);
    }
  }

  async saveFinances() {
    const items = await this.items$.pipe(first()).toPromise();
    if (this.template) {
      const { data } = await this.updateFinances
        .mutate({
          id: this.template.id,
          finances: { items },
        })
        .toPromise();
      if (data?.updateTemplateFinances?.finances) {
        this.items$.next(data.updateTemplateFinances.finances.items);
      }
    }
  }
}
