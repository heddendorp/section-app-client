import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewOrganizerDialogComponent } from '@tumi/legacy-app/modules/tenant/components/new-organizer-dialog/new-organizer-dialog.component';
import {
  CreateOrganizerGQL,
  GetOrganizersGQL,
  GetOrganizersQuery,
  UpdateOrganizerGQL,
} from '@tumi/legacy-app/generated/generated';
import { firstValueFrom, map, Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { onlyCompleteData } from 'apollo-angular';

@Component({
  selector: 'app-tenant-organizers-page',
  templateUrl: './tenant-organizers-page.component.html',
  styleUrls: ['./tenant-organizers-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, AsyncPipe, RouterLink],
})
export class TenantOrganizersPageComponent {
  public organizers$: Observable<GetOrganizersQuery['eventOrganizers']>;
  private organizersQuery;
  private updateOrganizerGQL = inject(UpdateOrganizerGQL);

  constructor(
    private dialog: MatDialog,
    private getOrganizers: GetOrganizersGQL,
    private createOrganizer: CreateOrganizerGQL,
  ) {
    this.organizersQuery = this.getOrganizers.watch();
    this.organizers$ = this.organizersQuery.valueChanges.pipe(
      onlyCompleteData(),
      map(({ data }) => data.eventOrganizers),
    );
  }

  async addOrganizer() {
    const data = await this.dialog
      .open(NewOrganizerDialogComponent)
      .afterClosed()
      .toPromise();
    if (data) {
      await this.createOrganizer
        .mutate({ variables: { input: data } })
        .toPromise();
      this.organizersQuery.refetch();
    }
  }

  async editOrganizer(organizer: {
    __typename?: 'EventOrganizer';
    id: string;
    name: string;
    text: string;
  }) {
    const data = await firstValueFrom(
      this.dialog
        .open(NewOrganizerDialogComponent, { data: organizer })
        .afterClosed(),
    );
    if (data) {
      await firstValueFrom(
        this.updateOrganizerGQL.mutate({
          variables: { input: data, id: organizer.id },
        }),
      );
    }
  }
}
