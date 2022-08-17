import { AfterViewInit, Component, HostBinding } from '@angular/core';
import {
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  pairwise,
  share,
  throttleTime,
  tap,
} from 'rxjs';
import {
  trigger,
  state,
  transition,
  style,
  animate,
} from '@angular/animations';

enum VisibilityState {
  Visible = 'visible',
  Hidden = 'hidden',
}

enum Direction {
  Up = 'Up',
  Down = 'Down',
}

@Component({
  selector: 'app-reactive-toolbar',
  templateUrl: './reactive-toolbar.component.html',
  styleUrls: ['./reactive-toolbar.component.scss'],
  animations: [
    trigger('toggle', [
      state(
        VisibilityState.Hidden,
        style({ opacity: 0, transform: 'translateY(-100%)' })
      ),
      state(
        VisibilityState.Visible,
        style({ opacity: 1, transform: 'translateY(0)' })
      ),
      transition('* => *', animate('200ms ease-in')),
    ]),
  ],
})
export class ReactiveToolbarComponent implements AfterViewInit {
  public isVisible = true;

  @HostBinding('@toggle')
  get toggle(): VisibilityState {
    return this.isVisible ? VisibilityState.Visible : VisibilityState.Hidden;
  }

  ngAfterViewInit() {
    const windowContent = document.getElementById(
      'window-content'
    ) as HTMLElement;
    const scroll$ = fromEvent(windowContent, 'scroll').pipe(
      throttleTime(10),
      map(() => windowContent.scrollTop),
      pairwise(),
      map(([y1, y2]): Direction => (y2 < y1 ? Direction.Up : Direction.Down)),
      distinctUntilChanged(),
      share()
    );

    const goingUp$ = scroll$.pipe(
      filter((direction) => direction === Direction.Up)
    );

    const goingDown$ = scroll$.pipe(
      filter((direction) => direction === Direction.Down)
    );

    goingUp$.subscribe(() => {
      this.isVisible = true;
    });
    goingDown$.subscribe(() => {
      this.isVisible = false;
    });
  }
}
