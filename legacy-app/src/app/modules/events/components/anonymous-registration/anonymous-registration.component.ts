import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-anonymous-registration',
  templateUrl: './anonymous-registration.component.html',
  styleUrls: ['./anonymous-registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnonymousRegistrationComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
