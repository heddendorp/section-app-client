import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventTemplatesRoutingModule } from './event-templates-routing.module';
import { TemplateListPageComponent } from './pages/template-list-page/template-list-page.component';
import { TemplateDetailsPageComponent } from './pages/template-details-page/template-details-page.component';
import { CreateEventDialogComponent } from './components/create-event-dialog/create-event-dialog.component';
import { EventFormDialogComponent } from './components/event-form-dialog/event-form-dialog.component';
import { FinancePlannerComponent } from './components/finance-planner/finance-planner.component';
import { NewFinanceEntryDialogComponent } from './components/new-finance-entry-dialog/new-finance-entry-dialog.component';
import { TemplateListEntryComponent } from './components/template-list-entry/template-list-entry.component';
import { SharedModule } from '@tumi/legacy-app/modules/shared/shared.module';
import { MarkdownModule } from 'ngx-markdown';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { ChangeTemplateCategoryDialogComponent } from './components/change-template-category-dialog/change-template-category-dialog.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    TemplateListPageComponent,
    TemplateDetailsPageComponent,
    CreateEventDialogComponent,
    EventFormDialogComponent,
    FinancePlannerComponent,
    NewFinanceEntryDialogComponent,
    TemplateListEntryComponent,
    ChangeTemplateCategoryDialogComponent,
  ],
  imports: [
    CommonModule,
    EventTemplatesRoutingModule,
    SharedModule,
    MarkdownModule.forChild(),
    ReactiveFormsModule,
    MatTableModule,
    MatExpansionModule,
    MatCardModule,
  ],
})
export class EventTemplatesModule {}
