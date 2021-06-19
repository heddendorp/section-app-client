import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-attendance-dialog',
  templateUrl: './attendance-dialog.component.html',
  styleUrls: ['./attendance-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttendanceDialogComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
