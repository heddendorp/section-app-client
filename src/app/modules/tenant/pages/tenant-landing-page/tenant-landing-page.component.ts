import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ResetScrollDirective } from '../../../shared/directives/reset-scroll.directive';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveToolbarComponent } from '../../../shared/components/reactive-toolbar/reactive-toolbar.component';

@Component({
    selector: 'app-tenant-landing-page',
    templateUrl: './tenant-landing-page.component.html',
    styleUrls: ['./tenant-landing-page.component.scss'],
    standalone: true,
    imports: [
        ReactiveToolbarComponent,
        MatToolbarModule,
        ResetScrollDirective,
        MatButtonModule,
        RouterLink,
    ],
})
export class TenantLandingPageComponent {}
