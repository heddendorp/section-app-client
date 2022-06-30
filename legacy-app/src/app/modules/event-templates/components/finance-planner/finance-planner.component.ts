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
  startWith,
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
      organizers: [3, Validators.required],
      participants: [22, Validators.required],
      days: [1, Validators.required],
      proposedFee: [null],
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
        let maxTotalSubsidies = subsidyPerPerson * info.days * numberOfPeople;
        if (!info.notAnExcursion) {
          maxTotalSubsidies = Math.min(
            maxSubsidizedPercentage * totalCost,
            maxTotalSubsidies
          );
        }

        const minPrice = this.calculatePrice(
          totalCost,
          maxTotalSubsidies,
          info.participants
        );
        const maxPrice = this.calculatePrice(totalCost, 0, info.participants);

        const costPrice = totalCost / numberOfPeople;
        const recommendedPrice = {
          subsidies: minPrice.subsidies,
          participantFee: minPrice.participantFee,
          totalParticipantFees: minPrice.totalParticipantFees,
        };
        if (costPrice > minPrice.participantFee) {
          recommendedPrice.participantFee = totalCost / numberOfPeople;
          recommendedPrice.totalParticipantFees =
            this.estimateFeeReceived(costPrice) * info.participants;
          recommendedPrice.subsidies =
            totalCost - recommendedPrice.totalParticipantFees;
        }

        let proposedPrice = null;
        if (info.proposedFee !== null) {
          proposedPrice = {
            participantFee: info.proposedFee,
            totalParticipantFees:
              this.estimateFeeReceived(info.proposedFee) * info.participants,
            subsidies: 0,
            buffer: 0,
          };
          proposedPrice.subsidies = Math.max(
            0,
            totalCost - proposedPrice.totalParticipantFees
          );
          proposedPrice.buffer = maxTotalSubsidies - proposedPrice.subsidies;
        }

        return {
          totalCost,
          minPrice,
          maxPrice,
          recommendedPrice,
          proposedPrice,
        };
      })
    );
  }

  calculatePrice(
    totalCost: number,
    subsidies: number,
    participantCount: number
  ) {
    const totalParticipantFees = Math.max(0, totalCost - subsidies);
    const price = {
      subsidies: Math.min(totalCost, subsidies),
      participantFee: this.roundTo2Decimals(
        Math.max(0, totalCost - subsidies) / participantCount
      ),
      totalParticipantFees: totalParticipantFees,
    };
    if (price.participantFee > 0) {
      price.totalParticipantFees = price.participantFee * participantCount;
      price.participantFee = this.estimateFeeToPay(price.participantFee);
    }
    return price;
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
    return Math.round(amount * 100) / 100;
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
