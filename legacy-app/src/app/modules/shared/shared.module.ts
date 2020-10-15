import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from '@angular/material/form-field';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogModule,
} from '@angular/material/dialog';
import {
  ErrorStateMatcher,
  MatNativeDateModule,
  MatRippleModule,
  ShowOnDirtyErrorStateMatcher,
} from '@angular/material/core';
import { ConfirmDialog, EventListComponent } from './components';
import { IconSrcDirective } from './directives';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { ReactiveComponentModule } from '@ngrx/component';
import { MarkdownModule } from 'ngx-markdown';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { IconToastComponent } from './components/icon-toast.component';
import { A11yModule } from '@angular/cdk/a11y';
import { RouterModule } from '@angular/router';

const materialModules = [
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatListModule,
  // MatExpansionModule,
  // MatDividerModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
  // MatAutocompleteModule,
  // MatProgressSpinnerModule,
  MatCheckboxModule,
  // MatSlideToggleModule,
  MatMenuModule,
  MatSelectModule,
  MatCardModule,
  MatRippleModule,
  MatSnackBarModule,
  A11yModule,
  // MatChipsModule,
  // LayoutModule,
];

export const COMPONENTS = [
  ConfirmDialog,
  IconToastComponent,
  EventListComponent,
];
export const DIRECTIVES = [IconSrcDirective];

@NgModule({
  declarations: [COMPONENTS, DIRECTIVES],
  imports: [
    CommonModule,
    RouterModule.forChild([]),
    materialModules,
    FlexLayoutModule,
    ReactiveFormsModule,
    ReactiveComponentModule,
    MarkdownModule,
  ],
  exports: [
    materialModules,
    COMPONENTS,
    DIRECTIVES,
    FlexLayoutModule,
    ReactiveFormsModule,
    ReactiveComponentModule,
    MarkdownModule,
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
      useValue: { appearance: 'outline' },
    },
  ],
})
export class SharedModule {
  constructor(registry: MatIconRegistry, sanitizer: DomSanitizer) {
    registry.addSvgIconSet(
      sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/set.svg')
    );
  }
}
