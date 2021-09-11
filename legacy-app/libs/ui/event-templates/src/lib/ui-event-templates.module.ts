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

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: TemplateListPageComponent },
    ]),
    UtilComponentsModule,
    UtilPipesModule,
    FlexLayoutModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  declarations: [TemplateListPageComponent, EventFormDialogComponent],
})
export class UiEventTemplatesModule {}
