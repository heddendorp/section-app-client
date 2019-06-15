import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-table',
  templateUrl: './event-table.component.html',
  styleUrls: ['./event-table.component.scss']
})
export class EventTableComponent implements OnInit {
  constructor() {}
  displayedColumns: string[] = ['date', 'name', 'time', 'tutors', 'tutornum'];
  ngOnInit() {}
}
