import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventFormDialogComponent } from '../../components/event-form-dialog/event-form-dialog.component';

@Component({
  selector: 'tumi-template-list-page',
  templateUrl: './template-list-page.component.html',
  styleUrls: ['./template-list-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateListPageComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.dialog.open(EventFormDialogComponent, { minWidth: '70vw' });
  }
}
