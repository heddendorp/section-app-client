import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-for-students-page',
  templateUrl: './for-students-page.component.html',
  styleUrls: ['./for-students-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForStudentsPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
