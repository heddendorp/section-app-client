import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateDetailsPageComponent } from '@tumi/legacy-app/modules/event-templates/pages/template-details-page/template-details-page.component';
import { TemplateListPageComponent } from '@tumi/legacy-app/modules/event-templates/pages/template-list-page/template-list-page.component';
import { CheckTemplateIdGuard } from '@tumi/legacy-app/modules/event-templates/guards/check-template-id.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: TemplateListPageComponent,
    title: 'Event Templates',
  },
  {
    path: ':templateId',
    canActivate: [CheckTemplateIdGuard],
    component: TemplateDetailsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventTemplatesRoutingModule {}
