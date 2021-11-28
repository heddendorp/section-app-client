import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'tumi-address-change-dialog',
  templateUrl: './address-change-dialog.component.html',
  styleUrls: ['./address-change-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressChangeDialogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
