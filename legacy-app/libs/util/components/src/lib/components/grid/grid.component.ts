import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'tumi-grid',
  template: `
    <div
      gdAuto
      gdColumns="repeat(auto-fit, minmax(min(100%, {{ minWidth }}), 1fr))"
      [gdGap]="gap"
    >
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent {
  @Input() minWidth = '400px';
  @Input() gap = '1rem';
}
