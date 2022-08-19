import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  distinctUntilChanged,
  fromEvent,
  map,
  Observable,
  pairwise,
  share,
  Subscription,
  throttleTime,
  partition,
  merge,
} from 'rxjs';
import {
  trigger,
  state,
  style,
} from '@angular/animations';

enum VisibilityState {
  Visible = 'visible',
  Hidden = 'hidden',
}

enum ScrollDirection {
  Up = 'Up',
  Down = 'Down',
}

@Component({
  selector: 'app-reactive-toolbar',
  templateUrl: './reactive-toolbar.component.html',
  styleUrls: ['./reactive-toolbar.component.scss'],
  animations: [
    trigger('header', [
      state(
        VisibilityState.Hidden,
        style({ opacity: 0, transform: 'translateY(-100%)' })
      ),
      state(
        VisibilityState.Visible,
        style({ opacity: 1, transform: 'translateY(0)' })
      )
    ]),
  ],
})
export class ReactiveToolbarComponent implements OnInit, OnDestroy {
  private scrollSubscription: Subscription | null = null;
  visibility = VisibilityState.Visible;
  scrollUp$: Observable<ScrollDirection>;
  scrollDown$: Observable<ScrollDirection>;

  constructor(private zone: NgZone, private cdr: ChangeDetectorRef) {    
    const scroll$ = fromEvent(window, 'scroll').pipe(
      throttleTime(10),
      map(() => window.pageYOffset),
      pairwise(),
      map(
        ([y1, y2]): ScrollDirection =>
          y2 < y1 ? ScrollDirection.Up : ScrollDirection.Down
      ),
      distinctUntilChanged(),
      share()
    );
    [this.scrollUp$, this.scrollDown$] = partition(
      scroll$,
      (scrollDirection: ScrollDirection) =>
        scrollDirection === ScrollDirection.Up
    );
  }

  ngOnInit() {
    // disable on iOS due to elastic scroll issues
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)){
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.scrollSubscription = merge(
        this.scrollUp$.pipe(map(() => VisibilityState.Visible)),
        this.scrollDown$.pipe(map(() => VisibilityState.Hidden))
      ).subscribe((visibility) => {
        this.visibility = visibility;
        this.cdr.detectChanges();
      });
    });
  }

  ngOnDestroy() {
    this.scrollSubscription?.unsubscribe();
  }
}
