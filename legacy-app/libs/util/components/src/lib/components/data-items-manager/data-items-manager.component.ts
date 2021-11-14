import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  CreateSubmissionItemGQL,
  DeleteSubmissionItemGQL,
  EventSubmissionItem,
} from '@tumi/data-access';
import { MatDialog } from '@angular/material/dialog';
import { NewDataItemDialogComponent } from '../new-data-item-dialog/new-data-item-dialog.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'tumi-data-items-manager',
  templateUrl: './data-items-manager.component.html',
  styleUrls: ['./data-items-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataItemsManagerComponent {
  @Input() public items: Array<
    Pick<
      EventSubmissionItem,
      'id' | 'instruction' | 'name' | 'type' | 'submissionTime'
    > &
      Partial<EventSubmissionItem>
  > = [];
  @Input() public parentId = '';
  @Input() public mode: 'event' | 'product' = 'event';
  @Output() public reloadParent = new EventEmitter<void>();
  constructor(
    private dialog: MatDialog,
    private createSubmissionItemGQL: CreateSubmissionItemGQL,
    private deleteSubmissionItemGQL: DeleteSubmissionItemGQL
  ) {}

  async addItem() {
    const item = await firstValueFrom(
      this.dialog
        .open(NewDataItemDialogComponent, {
          data: {
            mode: this.mode,
          },
          minWidth: '280px',
          width: '80vw',
          maxWidth: '560px',
          panelClass: 'modern',
        })
        .afterClosed()
    );
    if (item) {
      await firstValueFrom(
        this.createSubmissionItemGQL.mutate({
          target: this.mode,
          id: this.parentId,
          input: item,
        })
      );
      this.reloadParent.emit();
    }
  }

  async removeItem(id: string) {
    await firstValueFrom(
      this.deleteSubmissionItemGQL.mutate({
        id: id,
      })
    );
    this.reloadParent.emit();
  }
}
