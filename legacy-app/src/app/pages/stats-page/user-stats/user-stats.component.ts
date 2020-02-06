import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.scss']
})
export class UserStatsComponent implements OnInit {
  @Input() stats;

  constructor() {
  }

  ngOnInit() {
  }

}
