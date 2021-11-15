import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TenantLandingPageComponent } from './pages/tenant-landing-page/tenant-landing-page.component';
import { TenantOrganizersPageComponent } from './pages/tenant-organizers-page/tenant-organizers-page.component';
import { MatButtonModule } from '@angular/material/button';
import { NewOrganizerDialogComponent } from './components/new-organizer-dialog/new-organizer-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { TenantUsersPageComponent } from './pages/tenant-users-page/tenant-users-page.component';
import { MatTableModule } from '@angular/material/table';
import { UpdateUserDialogComponent } from './components/update-user-dialog/update-user-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { TenantRegistrationsPageComponent } from './pages/registrations/tenant-registrations-page/tenant-registrations-page.component';
import { TenantRefundsPageComponent } from './pages/tenant-refunds-page/tenant-refunds-page.component';
import { TenantEditPageComponent } from './pages/tenant-edit-page/tenant-edit-page.component';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { TenantUserInfoPageComponent } from './pages/tenant-user-info-page/tenant-user-info-page.component';
import { TenantProductsPageComponent } from './pages/tenant-products-page/tenant-products-page.component';
import { TenantStatsPageComponent } from './pages/tenant-stats-page/tenant-stats-page.component';
import { UtilComponentsModule } from '@tumi/util-components';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TenantMoveOrdersPageComponent } from './pages/registrations/tenant-move-orders-page/tenant-move-orders-page.component';
import { UtilMaterialModule } from '@tumi/util/material';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TenantActivityLogPageComponent } from './pages/tenant-activity-log-page/tenant-activity-log-page.component';
import { ShowDataDialogComponent } from './components/show-data-dialog/show-data-dialog.component';
import { TenantPhotosPageComponent } from './pages/tenant-photos-page/tenant-photos-page.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TenantRegistrationCodePageComponent } from './pages/registrations/tenant-registration-code-page/tenant-registration-code-page.component';
import { TenantPurchasesPageComponent } from './pages/tenant-purchases-page/tenant-purchases-page.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: TenantLandingPageComponent },
      { path: 'organizers', component: TenantOrganizersPageComponent },
      { path: 'users', component: TenantUsersPageComponent },
      { path: 'users/:userId', component: TenantUserInfoPageComponent },
      { path: 'registrations', component: TenantRegistrationsPageComponent },
      { path: 'codes', component: TenantMoveOrdersPageComponent },
      { path: 'codes/:codeId', component: TenantRegistrationCodePageComponent },
      { path: 'refunds', component: TenantRefundsPageComponent },
      { path: 'edit', component: TenantEditPageComponent },
      { path: 'stats', component: TenantStatsPageComponent },
      { path: 'logs', component: TenantActivityLogPageComponent },
      { path: 'photos', component: TenantPhotosPageComponent },
      { path: 'purchases', component: TenantPurchasesPageComponent },
    ]),
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatListModule,
    MatTableModule,
    MatSelectModule,
    FlexModule,
    ClipboardModule,
    UtilComponentsModule,
    FlexLayoutModule,
    UtilMaterialModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    NgxChartsModule,
    MatPaginatorModule,
  ],
  declarations: [
    TenantLandingPageComponent,
    TenantOrganizersPageComponent,
    NewOrganizerDialogComponent,
    TenantUsersPageComponent,
    UpdateUserDialogComponent,
    TenantRegistrationsPageComponent,
    TenantRefundsPageComponent,
    TenantEditPageComponent,
    TenantUserInfoPageComponent,
    TenantProductsPageComponent,
    TenantStatsPageComponent,
    TenantMoveOrdersPageComponent,
    TenantActivityLogPageComponent,
    ShowDataDialogComponent,
    TenantPhotosPageComponent,
    TenantRegistrationCodePageComponent,
    TenantPurchasesPageComponent,
  ],
})
export class UiTenantModule {}
