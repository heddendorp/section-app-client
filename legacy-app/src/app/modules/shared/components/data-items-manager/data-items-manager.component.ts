import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import {
  CreateSubmissionItemGQL,
  DeleteSubmissionItemGQL,
  EventSubmissionItem,
  SubmissionItemType,
} from '@tumi/legacy-app/generated/generated';
import { NewDataItemDialogComponent } from '@tumi/legacy-app/modules/shared/components/new-data-item-dialog/new-data-item-dialog.component';

@Component({
  selector: 'app-data-items-manager',
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
      if (item.type !== SubmissionItemType.Select) {
        item.data = {};
      }
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
