import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-expired-page',
  imports: [NgOptimizedImage],
  templateUrl: './expired-page.component.html',
  styleUrl: './expired-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpiredPageComponent {}
