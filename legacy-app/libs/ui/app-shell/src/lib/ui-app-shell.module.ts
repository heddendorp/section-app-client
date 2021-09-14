import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UiAuthModule } from '@tumi/ui-auth';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UtilMaterialModule } from '@tumi/util/material';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    UtilMaterialModule,
    MatButtonModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    UiAuthModule,
    RouterModule.forChild([]),
    FlexLayoutModule,
  ],
  declarations: [NavigationComponent],
  exports: [NavigationComponent],
})
export class UiAppShellModule {}
