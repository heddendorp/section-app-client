import {
  GetEventTemplateQuery,
  UpdateFinancesGQL,
} from '@tumi/legacy-app/generated/generated';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  combineLatest,
  first,
  firstValueFrom,
  map,
  Observable,
  ReplaySubject,
} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NewFinanceEntryDialogComponent } from '@tumi/legacy-app/modules/event-templates/components/new-finance-entry-dialog/new-finance-entry-dialog.component';

interface CostItem {
  description: string;
  value: number;
  type: string;
  prepaid: boolean;
  details: string;
  scale?: number;
}

@Component({
  selector: 'app-finance-planner',
  templateUrl: './finance-planner.component.html',
  styleUrls: ['./finance-planner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancePlannerComponent implements OnChanges {
  @Input() public template: GetEventTemplateQuery['eventTemplate'] | undefined;
  public displayedColumns = [
    'description',
    'value',
    'scale',
    'prepaid',
    'action',
  ];
  public items$ = new ReplaySubject<CostItem[]>(1);
  public forecastForm: UntypedFormGroup;
  public forecastResult$: Observable<any>;

  constructor(
    private dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private updateFinances: UpdateFinancesGQL
  ) {
    this.forecastForm = this.fb.group({
      organizers: [0, Validators.required],
      participants: [0, Validators.required],
      days: [1, Validators.required],
      notAnExcursion: [false, Validators.required],
    });
    this.forecastResult$ = combineLatest([
      this.items$,
      this.forecastForm.valueChanges,
    ]).pipe(
      map(([items, info]) => {
        const numberOfPeople = info.organizers + info.participants;
        const totalCost = this.getTotalCost([items, info]);

        const subsidyPerPerson = info.days > 1 ? 30 : 20;
        const maxSubsidizedPercentage = info.notAnExcursion ? 1.0 : 0.75;
        const maxTotalSubsidies = Math.min(
          maxSubsidizedPercentage * totalCost,
          subsidyPerPerson * info.days * numberOfPeople
        );

        // this is a pessimistic estimate
        const expectedStripeFees =
          (0.25 + (totalCost / numberOfPeople) * 0.015) * info.participants;
        const totalCostWithFees = totalCost + expectedStripeFees;

        const costWithoutSubsidies = totalCostWithFees / info.participants;
        const minPrice =
          (totalCostWithFees - maxTotalSubsidies) / info.participants;
        const recommendedPrice = Math.max(totalCost / numberOfPeople, minPrice);

        return {
          totalCost,
          maxTotalSubsidies,
          expectedStripeFees,
          minPrice,
          costWithoutSubsidies,
          recommendedPrice,
        };
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['template'] && changes['template'].firstChange) {
      this.items$.next(changes['template'].currentValue.finances.items);
    }
  }

  async addItem() {
    const newItem = await this.dialog
      .open(NewFinanceEntryDialogComponent)
      .afterClosed()
      .toPromise();
    if (newItem) {
      const items = await this.items$.pipe(first()).toPromise();
      this.items$.next([...(items ?? []), newItem]);
    }
  }

  async saveFinances() {
    const items = await this.items$.pipe(first()).toPromise();
    if (this.template) {
      const { data } = await firstValueFrom(
        this.updateFinances.mutate({
          id: this.template.id,
          finances: { items },
        })
      );
      if (data?.updateTemplateFinances?.finances) {
        this.items$.next(data.updateTemplateFinances.finances.items);
      }
    }
  }

  async removeItem(element: CostItem) {
    const items = await firstValueFrom(this.items$);
    this.items$.next(
      items.filter((item) => item.description !== element.description)
    );
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
}
