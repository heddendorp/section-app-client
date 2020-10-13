import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, Observable, of } from 'rxjs';
import {
  catchError,
  map,
  shareReplay,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(
    private store: AngularFirestore,
    private auth: AuthService,
    private userService: UserService
  ) {}

  public addEvent(event: any): Promise<any> {
    return this.store.collection('events').add(event);
  }

  public updateEvent(id: string, update: any): Promise<any> {
    return this.store.collection('events').doc(id).update(update);
  }

  public updateRegistration(
    eventId: string,
    id: string,
    update: any
  ): Promise<any> {
    return this.store
      .collection('events')
      .doc(eventId)
      .collection('signups')
      .doc(id)
      .update(update);
  }

  getOne$(id: string): Observable<any> {
    return this.store
      .collection('events')
      .doc<any>(id)
      .valueChanges()
      .pipe(
        map((event) => ({ ...event, id })),
        this.mapEvents,
        shareReplay()
      );
  }

  upcomingOfTypes$(types: string[]): Observable<any[]> {
    return combineLatest([this.auth.isTutor$, this.auth.isEditor$]).pipe(
      switchMap(([isTutor, isEditor]: [boolean, boolean]) => {
        const visibility = ['public'];
        if (isTutor) {
          visibility.push('internal');
        }
        if (isEditor) {
          visibility.push('draft');
        }
        console.log(visibility);
        return this.store
          .collection('events', (ref) =>
            ref
              .where('start', '>', new Date())
              .where('visibility', 'in', visibility)
              .orderBy('start', 'asc')
          )
          .valueChanges({ idField: 'id' })
          .pipe(
            this.mapEvents,
            map((events) =>
              events.filter((event: any) => types.includes(event.type))
            ),
            catchError((err) => {
              console.log(err);
              console.log(visibility);
              return of([]);
            }),
            shareReplay()
          );
      }),
      catchError((err) => {
        console.log(err);
        console.log(types);
        return of([]);
      })
    );
  }

  deleteEvent(id: string): Promise<void> {
    return this.store.collection('events').doc(id).delete();
  }

  removeRegistration(eventId: string, id: string): Promise<void> {
    return this.store
      .collection('events')
      .doc(eventId)
      .collection('signups')
      .doc(id)
      .delete();
  }

  private transformEvent = (event: any) => {
    if (!event.tutorSignups) {
      console.log(event);
    }
    return {
      ...event,
      start: event.start.toDate(),
      end: event.end.toDate(),
      registeredTutors: this.userService.getUserList$(event.tutorSignups),
      registrations: this.store
        .collection('events')
        .doc(event.id)
        .collection('signups')
        .valueChanges({ idField: 'id' })
        .pipe(
          withLatestFrom(this.auth.isTutor$),
          switchMap(([registrations, isTutor]: [any[], boolean]) =>
            isTutor
              ? this.userService.populateRegistrationList$(registrations)
              : of(registrations)
          ),
          shareReplay()
        ),
    };
  };

  private mapEvents = map((events: any[] | any) =>
    Array.isArray(events)
      ? events.filter((event) => !!event.start).map(this.transformEvent)
      : this.transformEvent(events)
  );
}
