/*
 *     The TUMi app provides a modern way of managing events for an esn section.
 *     Copyright (C) 2020  Lukas Heddendorp
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { SharedModule } from '../shared/shared.module';
import { AboutPageComponent } from './about-page/about-page.component';
import { ChangelogPageComponent } from './changelog-page/changelog-page.component';
import { DataPrivacyPageComponent } from './data-privacy-page/data-privacy-page.component';
import { HelpPageComponent } from './help-page/help-page.component';
import { ImprintPageComponent } from './imprint-page/imprint-page.component';
import { LpPageComponent } from './lp-page/lp-page.component';
import { AgendaExplorerComponent } from './na-page/agenda-explorer/agenda-explorer.component';
import { NaPageComponent } from './na-page/na-page.component';
import { NaRedirectDialogComponent } from './na-page/na-redirect-dialog/na-redirect-dialog.component';
import { PaPageComponent } from './pa-page/pa-page.component';
import { SignupPageComponent } from './signup-page/signup-page.component';
import { StatsPageComponent } from './stats-page/stats-page.component';
import { EventStatsComponent } from './stats-page/event-stats/event-stats.component';
import { UserStatsComponent } from './stats-page/user-stats/user-stats.component';
import { PartyAnimalsPromoPageComponent } from './party-animals-promo-page/party-animals-promo-page.component';
import { PaRegistrationPageComponent } from './party-animals-promo-page/pa-registration-page/pa-registration-page.component';
import { CovPageComponent } from './cov-page/cov-page.component';

const routes: Routes = [
  { path: 'about', data: { standalone: true, title: 'About' }, component: AboutPageComponent },
  { path: 'help', data: { title: 'Help' }, component: HelpPageComponent },
  { path: 'pa-ws19', data: { standalone: true, title: 'Party Animals' }, component: PaPageComponent },
  { path: 'party-animals', data: { standalone: true, title: 'Party Animals' }, component: PartyAnimalsPromoPageComponent },
  { path: 'pa-register', data: { standalone: true, title: 'PA - Sign Up' }, component: PaRegistrationPageComponent },
  { path: 'cov', data: { standalone: true, title: 'CoV - Notice' }, component: CovPageComponent },
  { path: 'lp', data: { standalone: true, title: 'Local Platform' }, component: LpPageComponent },
  { path: 'na', data: { standalone: true, title: 'National Assembly' }, component: NaPageComponent },
  { path: 'signup', data: { title: 'Login' }, component: SignupPageComponent },
  { path: 'changes', data: { title: 'Changes' }, component: ChangelogPageComponent },
  { path: 'imprint', data: { title: 'Imprint' }, component: ImprintPageComponent },
  { path: 'data-privacy', data: { title: 'Privacy' }, component: DataPrivacyPageComponent },
  { path: 'stats', data: { title: 'Statistics' }, component: StatsPageComponent }
];

@NgModule({
  declarations: [
    AboutPageComponent,
    SignupPageComponent,
    PaPageComponent,
    HelpPageComponent,
    ImprintPageComponent,
    DataPrivacyPageComponent,
    LpPageComponent,
    NaPageComponent,
    NaRedirectDialogComponent,
    ChangelogPageComponent,
    AgendaExplorerComponent,
    StatsPageComponent,
    EventStatsComponent,
    UserStatsComponent,
    PartyAnimalsPromoPageComponent,
    PaRegistrationPageComponent,
    CovPageComponent
  ],
  entryComponents: [NaRedirectDialogComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, MarkdownModule.forChild()]
})
export class PagesModule {}
