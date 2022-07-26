import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-apply-page',
  templateUrl: './apply-page.component.html',
  styleUrls: ['./apply-page.component.scss'],
})
export class ApplyPageComponent {
  constructor(private title: Title) {
    this.title.setTitle('TUMi - Application');
  }
}
