import { Component, Input } from '@angular/core';
import { IconURLPipe } from '@tumi/legacy-app/modules/shared/pipes/icon-url.pipe';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';

@Component({
    selector: 'app-event-chip',
    templateUrl: './event-chip.component.html',
    styleUrls: ['./event-chip.component.scss'],
    standalone: true,
    imports: [
        MatRippleModule,
        RouterLink,
        NgIf,
        IconURLPipe,
    ],
})
export class EventChipComponent {
  @Input()
  public icon: string = '';

  @Input()
  public id: string = '';

  @Input()
  public title: string = '';
}
