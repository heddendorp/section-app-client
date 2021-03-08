import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  ErrorStateMatcher,
  MatNativeDateModule,
  ShowOnDirtyErrorStateMatcher,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogModule,
} from '@angular/material/dialog';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBar,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { ReactiveComponentModule } from '@ngrx/component';
import { environment } from '@tumi/environments/environment';
import { MarkdownModule } from 'ngx-markdown';
import { concat, interval } from 'rxjs';
import { first } from 'rxjs/operators';
import {
  ConfirmDialogComponent,
  EventGridComponent,
  IconToastComponent,
} from './components';
import { IconSrcDirective } from './directives';
import { RightsManagerComponent } from './components/rights-manager/rights-manager.component';
import * as Sentry from '@sentry/angular';

const materialModules = [
  MatSidenavModule,
  MatIconModule,
  MatButtonModule,
  MatListModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatMenuModule,
  MatSelectModule,
  MatSnackBarModule,
  MatTableModule,
  A11yModule,
];

export const COMPONENTS = [
  ConfirmDialogComponent,
  IconToastComponent,
  EventGridComponent,
];
export const DIRECTIVES = [IconSrcDirective];

@NgModule({
  declarations: [COMPONENTS, DIRECTIVES, RightsManagerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([]),
    ...materialModules,
    FlexLayoutModule,
    ReactiveFormsModule,
    ReactiveComponentModule,
    MarkdownModule,
  ],
  exports: [
    ...materialModules,
    COMPONENTS,
    DIRECTIVES,
    FlexLayoutModule,
    ReactiveFormsModule,
    ReactiveComponentModule,
    MarkdownModule,
    RightsManagerComponent,
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3000 } },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        minWidth: '50vw',
        closeOnNavigation: true,
        disableClose: false,
        hasBackdrop: true,
      },
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'fill' },
    },
  ],
})
export class SharedModule {
  constructor(
    registry: MatIconRegistry,
    sanitizer: DomSanitizer,
    appRef: ApplicationRef,
    updates: SwUpdate,
    snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) platform: any
  ) {
    registry.addSvgIconSet(
      sanitizer.bypassSecurityTrustResourceUrl(
        environment.production
          ? 'https://tumi.esn.world/assets/icons/set.svg'
          : 'http://localhost:4200/assets/icons/set.svg'
      )
    );
    const appIsStable$ = appRef.isStable.pipe(first((isStable) => isStable));
    const updateCheckTimer$ = interval(0.5 * 2 * 60 * 1000);
    const updateChecksOnceAppStable$ = concat(appIsStable$, updateCheckTimer$);
    if (environment.production && isPlatformBrowser(platform)) {
      updateChecksOnceAppStable$.subscribe(() =>
        updates
          .checkForUpdate()
          .catch((e) => Sentry.captureMessage(e.message, Sentry.Severity.Info))
      );
    }
    updates.available.subscribe((event) => {
      snackBar
        .openFromComponent(IconToastComponent, {
          duration: 0,
          data: {
            message: 'A new version of this app is available!',
            action: 'Activate now',
            icon: 'icon-available-updates',
          },
        })
        .onAction()
        .subscribe(() =>
          updates.activateUpdate().then(() => document.location.reload())
        );
    });
  }
}
