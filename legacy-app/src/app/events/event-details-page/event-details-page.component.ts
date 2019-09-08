import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TumiEvent } from '../../shared/services/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IconToastComponent } from '../../shared/components/icon-toast/icon-toast.component';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-event-details-page',
  templateUrl: './event-details-page.component.html',
  styleUrls: ['./event-details-page.component.scss']
})
export class EventDetailsPageComponent implements OnInit {
  event$: Observable<TumiEvent>;
  signed$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private fireFunctions: AngularFireFunctions,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.event$ = this.route.data.pipe(map(data => data.event));
    this.signed$ = this.event$.pipe(
      switchMap(event =>
        this.authService.user.pipe(
          map(
            user => event.tutorSignups.includes(user.id) || event.userSignups.map(signup => signup.id).includes(user.id)
          )
        )
      )
    );
  }

  async registerTutor(eventId) {
    const snack = this.snackBar.openFromComponent(IconToastComponent, {
      data: { message: "Please wait while we're signing you up", icon: 'wait' },
      duration: 0
    });
    await this.fireFunctions
      .httpsCallable<{ eventId: string; type: 'tutor' | 'student' }, any>('registerForEvent')({
        eventId,
        type: 'tutor'
      })
      .toPromise();
    snack.dismiss();
    await this.router.navigate(['events', 'my']);
  }

  async registerStudent(eventId) {
    const snack = this.snackBar.openFromComponent(IconToastComponent, {
      data: { message: "Please wait while we're signing you up", icon: 'wait' },
      duration: 0
    });
    await this.fireFunctions
      .httpsCallable<{ eventId: string; type: 'tutor' | 'student' }, any>('registerForEvent')({
        eventId,
        type: 'student'
      })
      .toPromise();
    snack.dismiss();
    await this.router.navigate(['events', 'my']);
  }
}
