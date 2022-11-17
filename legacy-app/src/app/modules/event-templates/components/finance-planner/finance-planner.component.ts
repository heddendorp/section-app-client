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
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  combineLatest,
  first,
  firstValueFrom,
  map,
  Observable,
  ReplaySubject,
  startWith,
  tap,
} from 'rxjs';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { NewFinanceEntryDialogComponent } from '@tumi/legacy-app/modules/event-templates/components/new-finance-entry-dialog/new-finance-entry-dialog.component';

interface CostItem {
  description: string;
  value: number;
  type: string;
  onInvoice: boolean;
  notSubsidized: boolean;
  details: string;
  scale?: number;
}

export interface PriceModel {
  income: number;
  participantFee: number;
  totalParticipantFees: number;
  subsidies: number;
  maxSubsidies: number;
  subsidyPercentage: number;
  subsidyBuffer: number;
  expenses: number;
  expensesSubsidizable: number;
  expensesNotSubsidizable: number;
  balance: number;
}

@Component({
  selector: 'app-finance-planner',
  templateUrl: './finance-planner.component.html',
  styleUrls: ['./finance-planner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancePlannerComponent implements OnChanges {
  @Input() public template: GetEventTemplateQuery['eventTemplate'] | undefined;
  @Output() public recommendedPriceChange = new EventEmitter<number>();
  public displayedColumns = [
    'description',
    'value',
    'scale',
    'onInvoice',
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
      organizers: [3, Validators.required],
      participants: [22, Validators.required],
      days: [1, Validators.required],
      proposedFee: [null],
      notAnExcursion: [false, Validators.required],
    });
    this.forecastResult$ = combineLatest([
      this.items$,
      this.forecastForm.valueChanges.pipe(startWith(this.forecastForm.value)),
    ]).pipe(
      map(([items, info]) => {
        const numberOfPeople = info.organizers + info.participants;
        const expenses = this.getTotalCost([items, info]);
        const expensesNotSubsidizable = this.getTotalCost([items, info], true);
        const expensesSubsidizable = expenses - expensesNotSubsidizable;

        const subsidyPerPerson = +info.days > 1 ? 30 : 20;
        const maxSubsidizedPercentage = info.notAnExcursion ? 1.0 : 0.75;
        let maxTotalSubsidies = subsidyPerPerson * info.days * numberOfPeople;
        maxTotalSubsidies = Math.min(
          maxSubsidizedPercentage * expensesSubsidizable,
          maxTotalSubsidies
        );

        const minPrice = this.estimateFeeToPay(
          (Math.max(0, expensesSubsidizable - maxTotalSubsidies) +
            expensesNotSubsidizable) /
            info.participants
        );
        const minPriceModel = this.calculatePriceModelForPrice(
          info.participants,
          minPrice,
          maxTotalSubsidies,
          expenses,
          expensesSubsidizable,
          expensesNotSubsidizable
        );

        let recommendedPrice = expenses / numberOfPeople;
        if (recommendedPrice < minPrice) {
          recommendedPrice = minPrice;
        }
        const recommendedPriceModel = this.calculatePriceModelForPrice(
          info.participants,
          recommendedPrice,
          maxTotalSubsidies,
          expenses,
          expensesSubsidizable,
          expensesNotSubsidizable
        );

        const maxPrice = this.estimateFeeToPay(expenses / info.participants);
        const maxPriceModel = this.calculatePriceModelForPrice(
          info.participants,
          maxPrice,
          maxTotalSubsidies,
          expenses,
          expensesSubsidizable,
          expensesNotSubsidizable
        );

        const proposedPriceModel = info.proposedFee
          ? this.calculatePriceModelForPrice(
              info.participants,
              info.proposedFee,
              maxTotalSubsidies,
              expenses,
              expensesSubsidizable,
              expensesNotSubsidizable
            )
          : null;

        return {
          proposedPriceModel,
          recommendedPriceModel,
          minPriceModel,
          maxPriceModel,
        };
      }),
      tap((result) => {
        this.recommendedPriceChange.emit(
          Math.ceil(result.maxPriceModel.participantFee)
        );
      })
    );
  }

  calculatePriceModelForPrice(
    participants: number,
    participantFee: number,
    maxSubsidies: number,
    expenses: number,
    expensesSubsidizable: number,
    expensesNotSubsidizable: number
  ): PriceModel {
    const totalParticipantFees =
      this.estimateFeeReceived(participantFee) * participants;
    let subsidies = Math.min(maxSubsidies, expensesSubsidizable);
    let totalIncome = totalParticipantFees + subsidies;
    let balance = totalIncome - expenses;

    const subsidyNotNeeded = Math.min(subsidies, Math.max(0, balance));
    subsidies = subsidies - subsidyNotNeeded;
    totalIncome = totalParticipantFees + subsidies;
    balance = totalIncome - expenses;

    const subsidyPercentage = subsidies / expenses;
    const subsidyBuffer = Math.max(0, maxSubsidies - subsidies);

    return {
      income: totalIncome,
      participantFee,
      totalParticipantFees,
      subsidies,
      maxSubsidies,
      subsidyPercentage,
      subsidyBuffer,
      expenses,
      expensesSubsidizable,
      expensesNotSubsidizable,
      balance,
    };
  }

  /** Estimates the fee that would need to be paid by a participant so we receive the desired amount
   * Example: a participant needs to pay ~20.56€ so that we receive 20€
   * The Stripe fee estimate is 0.25€ + amount * 1.5%
   * x - (0.25 + x*0.015) = y
   * This formula solves for the reverse
   */
  estimateFeeToPay(amount: number): number {
    if (amount === 0) return 0;
    return this.roundTo2Decimals((50 / 197) * (4 * amount + 1));
  }

  /** Estimates the actual amount of money we receive
   * Example: 20€ -> 19.45€
   */
  estimateFeeReceived(amount: number): number {
    if (amount === 0) return 0;
    return this.roundTo2Decimals(amount - (0.25 + amount * 0.015));
  }

  roundTo2Decimals(amount: number) {
    return Math.ceil(amount * 100) / 100;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['template'] && changes['template'].firstChange) {
      this.items$.next(changes['template'].currentValue.finances.items);
      this.forecastForm
        .get('participants')
        ?.setValue(changes['template'].currentValue.medianParticipantCount);
      this.forecastForm
        .get('organizers')
        ?.setValue(changes['template'].currentValue.medianOrganizerCount);
    }
  }

  async addItem() {
    const newItem = await this.dialog
      .open(NewFinanceEntryDialogComponent, { panelClass: 'modern' })
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

  private getTotalCost(
    [items, info]: [CostItem[], { participants: number; organizers: number }],
    notSubsized = false
  ) {
    return items
      .filter((item) => (notSubsized && item.notSubsidized) || !notSubsized)
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
