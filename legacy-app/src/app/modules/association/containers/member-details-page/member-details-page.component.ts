import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { MemberRights, MemberStatus, User } from '@tumi/models';
import { Invoice } from '@tumi/models/invoice';
import { IconToastComponent } from '@tumi/modules/shared';
import { AuthService, UserService } from '@tumi/services';
import { InvoiceService } from '@tumi/services/invoice.service';
import { Observable } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-member-details-page',
  templateUrl: './member-details-page.component.html',
  styleUrls: ['./member-details-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberDetailsPageComponent implements OnInit {
  user$: Observable<User>;
  invoices$: Observable<Invoice[]>;
  constructor(
    private users: UserService,
    private route: ActivatedRoute,
    private invoices: InvoiceService,
    private snackBar: MatSnackBar,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.user$ = this.route.paramMap.pipe(
      switchMap((params) => this.users.getOne$(params.get('userId') as string)),
      tap((data) => console.log(data))
    );
    this.invoices$ = this.route.paramMap.pipe(
      switchMap((params) =>
        this.invoices.getForUserId(params.get('userId') as string)
      ),
      tap(console.log)
    );
  }

  async updateRights(rights: MemberRights) {
    const user = await this.user$.pipe(first()).toPromise();
    await this.users.update(user.id, { rights });
  }

  async makeFullMember() {
    const user = await this.user$.pipe(first()).toPromise();
    await this.users.update(user.id, {
      joinedAsFullMember: new Date(),
      status: MemberStatus.full,
    });
  }

  public async sendInvoice(): Promise<void> {
    const user = await this.user$.pipe(first()).toPromise();
    await this.invoices.createInvoiceForUser(user);
    this.snackBar.openFromComponent(IconToastComponent, {
      data: {
        message: `Invoice created!`,
        icon: 'icon-checkmark',
      },
    });
  }
}
