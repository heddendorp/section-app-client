import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UtilPipesModule } from '@tumi/util/pipes';
import { UtilComponentsModule } from '@tumi/util-components';
import { UtilMaterialModule } from '@tumi/util/material';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: HomePageComponent },
    ]),
    FlexLayoutModule,
    UtilPipesModule,
    UtilComponentsModule,
    UtilMaterialModule,
  ],
  declarations: [HomePageComponent],
})
export class UiHomeModule {}
