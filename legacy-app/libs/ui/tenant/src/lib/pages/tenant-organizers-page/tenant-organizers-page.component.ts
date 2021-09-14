import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewOrganizerDialogComponent } from '../../components/new-organizer-dialog/new-organizer-dialog.component';
import {
  CreateOrganizerGQL,
  GetOrganizersGQL,
  GetOrganizersQuery,
} from '@tumi/data-access';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tumi-tenant-organizers-page',
  templateUrl: './tenant-organizers-page.component.html',
  styleUrls: ['./tenant-organizers-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantOrganizersPageComponent implements OnInit {
  public organizers$: Observable<GetOrganizersQuery['organizers']>;
  private organizersQuery;
  constructor(
    private dialog: MatDialog,
    private getOrganizers: GetOrganizersGQL,
    private createOrganizer: CreateOrganizerGQL
  ) {
    this.organizersQuery = this.getOrganizers.watch();
    this.organizers$ = this.organizersQuery.valueChanges.pipe(
      map(({ data }) => data.organizers)
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
