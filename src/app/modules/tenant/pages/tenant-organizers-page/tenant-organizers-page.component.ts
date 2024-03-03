import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewOrganizerDialogComponent } from '@tumi/legacy-app/modules/tenant/components/new-organizer-dialog/new-organizer-dialog.component';
import {
  CreateOrganizerGQL,
  GetOrganizersGQL,
  GetOrganizersQuery,
} from '@tumi/legacy-app/generated/generated';
import { map, Observable } from 'rxjs';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ResetScrollDirective } from '../../../shared/directives/reset-scroll.directive';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveToolbarComponent } from '../../../shared/components/reactive-toolbar/reactive-toolbar.component';

@Component({
  selector: 'app-tenant-organizers-page',
  templateUrl: './tenant-organizers-page.component.html',
  styleUrls: ['./tenant-organizers-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveToolbarComponent,
    MatToolbarModule,
    BackButtonComponent,
    ResetScrollDirective,
    NgIf,
    MatProgressBarModule,
    MatButtonModule,
    MatListModule,
    NgFor,
    AsyncPipe,
  ],
})
export class TenantOrganizersPageComponent implements OnInit {
  public organizers$: Observable<GetOrganizersQuery['eventOrganizers']>;
  private organizersQuery;

  constructor(
    private dialog: MatDialog,
    private getOrganizers: GetOrganizersGQL,
    private createOrganizer: CreateOrganizerGQL,
  ) {
    this.organizersQuery = this.getOrganizers.watch();
    this.organizers$ = this.organizersQuery.valueChanges.pipe(
      map(({ data }) => data.eventOrganizers),
    );
  }

  ngOnInit(): void {}

  async addOrganizer() {
    const data = await this.dialog
      .open(NewOrganizerDialogComponent)
      .afterClosed()
      .toPromise();
    if (data) {
      await this.createOrganizer.mutate({ input: data }).toPromise();
      this.organizersQuery.refetch();
    }
  }
}
