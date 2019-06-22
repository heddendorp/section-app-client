import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { first, map, takeUntil } from 'rxjs/operators';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MediaObserver } from '@angular/flex-layout';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from './shared/services/auth.service';
import { IconToastComponent } from './shared/components/icon-toast/icon-toast.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  destroyed$ = new Subject();
  isMobile$: Observable<boolean>;
  authenticated$: Observable<boolean>;
  signedUp$: Observable<boolean>;
  admin$: Observable<boolean>;

  constructor(
    san: DomSanitizer,
    registry: MatIconRegistry,
    private snackBar: MatSnackBar,
    private update: SwUpdate,
    private authService: AuthService,
    media: MediaObserver
  ) {
    registry.addSvgIconSet(san.bypassSecurityTrustResourceUrl('/assets/icons/set.svg'));
    this.isMobile$ = media
      .asObservable()
      .pipe(map(checks => !!checks.filter(check => check.matches).find(match => match.mqAlias === 'xs')));
  }

  ngOnInit(): void {
    this.authenticated$ = this.authService.authenticated;
    this.signedUp$ = this.authService.signedUp;
    this.admin$ = this.authService.isAdmin;
    timer(0, 60000)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.update.available.pipe(first()).subscribe(() => {
          this.snackBar
            .openFromComponent(IconToastComponent, {
              duration: 0,
              data: {
                message: 'A new version of this app is available!',
                action: 'Activate now',
                icon: 'update'
              }
            })
            .onAction()
            .subscribe(() => this.update.activateUpdate().then(() => document.location.reload()));
        });
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.complete();
  }
}
