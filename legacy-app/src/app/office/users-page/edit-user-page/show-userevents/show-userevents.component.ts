import { Component, Input, OnInit } from '@angular/core';
import { Student } from '../../../../shared/services/user.service';

@Component({
  selector: 'app-show-userevents',
  templateUrl: './show-userevents.component.html',
  styleUrls: ['./show-userevents.component.scss']
})
export class ShowUsereventsComponent implements OnInit {
  @Input() user: Student;

  constructor() {}

  ngOnInit() {}

  trackByFunction = object => object.id;
}
