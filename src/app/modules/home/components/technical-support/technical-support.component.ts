import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-technical-support',
  templateUrl: './technical-support.component.html',
  styleUrls: ['./technical-support.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgOptimizedImage],
})
export class TechnicalSupportComponent {}
