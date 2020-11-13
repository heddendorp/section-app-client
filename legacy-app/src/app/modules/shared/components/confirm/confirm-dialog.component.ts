import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content *ngIf="data.content">{{
      data.content
    }}</mat-dialog-content>
    <mat-dialog-actions>
      <button mat-flat-button color="warn" [mat-dialog-close]="data.result">
        Proceed
      </button>
      <button mat-flat-button mat-dialog-close>Cancel</button>
    </mat-dialog-actions>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; content?: string; result: any }
  ) {}
}
