import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TemplateListPageComponent } from './pages/template-list-page/template-list-page.component';
import { EventFormDialogComponent } from './components/event-form-dialog/event-form-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UtilComponentsModule } from '@tumi/util-components';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { UtilPipesModule } from '@tumi/util/pipes';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TemplateListEntryComponent } from './components/template-list-entry/template-list-entry.component';
import { TemplateDetailsPageComponent } from './pages/template-details-page/template-details-page.component';
import { CreateEventDialogComponent } from './components/create-event-dialog/create-event-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { UiAuthModule } from '@tumi/ui-auth';
import { MarkdownModule } from 'ngx-markdown';
import { MatListModule } from '@angular/material/list';
import { FinancePlannerComponent } from './components/finance-planner/finance-planner.component';
import { NewFinanceEntryDialogComponent } from './components/new-finance-entry-dialog/new-finance-entry-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: TemplateListPageComponent },
      { path: ':templateId', component: TemplateDetailsPageComponent },
    ]),
    UiAuthModule,
    UtilComponentsModule,
    UtilPipesModule,
    FlexLayoutModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSelectModule,
    MarkdownModule.forChild(),
    MatListModule,
    MatCheckboxModule,
    MatTableModule,
  ],
  declarations: [
    TemplateListPageComponent,
    EventFormDialogComponent,
    TemplateListEntryComponent,
    TemplateDetailsPageComponent,
    CreateEventDialogComponent,
    FinancePlannerComponent,
    NewFinanceEntryDialogComponent,
  ],
})
export class UiEventTemplatesModule {}
