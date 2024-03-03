import {
  ChangeDetectionStrategy,
  Component,
  inject,
  TemplateRef,
} from '@angular/core';
import { ConfigService } from '@tumi/legacy-app/services/config.service';
import {
  HomePageStrategy,
  MembershipStatus,
  Role,
} from '@tumi/legacy-app/generated/generated';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { AuthButtonComponent } from '@tumi/legacy-app/components/auth-button/auth-button.component';
import { IfRoleDirective } from '@tumi/legacy-app/modules/shared/directives/if-role.directive';
import { IfStatusDirective } from '@tumi/legacy-app/modules/shared/directives/if-status.directive';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IfGlobalAdminDirective } from '@tumi/legacy-app/modules/shared/directives/if-global-admin.directive';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    AsyncPipe,
    AuthButtonComponent,
    IfRoleDirective,
    IfStatusDirective,
    MatIcon,
    MatRipple,
    NgOptimizedImage,
    RouterLink,
    RouterLinkActive,
    IfGlobalAdminDirective,
    MatBottomSheetModule,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent {
  protected navSettings = inject(ConfigService).navData;
  protected readonly MembershipStatus = MembershipStatus;
  protected readonly HomePageStrategy = HomePageStrategy;
  protected readonly Role = Role;

  private bottomSheet = inject(MatBottomSheet);

  openOverflow(mobileOverflowNav: TemplateRef<any>) {
    this.bottomSheet.open(mobileOverflowNav, {
      panelClass: 'nav-bottom-sheet',
      closeOnNavigation: true,
    });
  }

  closeOverFlow() {
    this.bottomSheet.dismiss();
  }
}
