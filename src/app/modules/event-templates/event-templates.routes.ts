import { Routes } from '@angular/router';
import { TemplateListPageComponent } from '@tumi/legacy-app/modules/event-templates/pages/template-list-page/template-list-page.component';
import { CheckTemplateIdGuard } from '@tumi/legacy-app/modules/event-templates/guards/check-template-id.guard';
import { TemplateDetailsPageComponent } from '@tumi/legacy-app/modules/event-templates/pages/template-details-page/template-details-page.component';

export const EVENT_TEMPLATE_ROUTES: Routes = [
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
