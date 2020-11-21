import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { fromPromise } from 'rxjs/internal-compatibility';

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
      .collection<any>('events')
      .doc(id)
      .valueChanges({ idField: 'id' })
      .pipe(this.mapEvents, shareReplay(1));
  }

  upcomingOfTypes$({
    types,
    date,
  }: {
    types: string[];
    date: Date;
  }): Observable<any[]> {
    return combineLatest([this.auth.isTutor$, this.auth.isEditor$]).pipe(
      switchMap(([isTutor, isEditor]: [boolean, boolean]) => {
        const visibility = ['public'];
        if (isTutor) {
          visibility.push('internal');
        }
        if (isEditor) {
          visibility.push('draft');
        }
        return this.store
          .collection('events', (ref) =>
            ref
              .where('start', '>', date)
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

  public async register(
    user: any,
    event: any,
    isWaitList = false
  ): Promise<void> {
    await this.store
      .collection('events')
      .doc(event.id)
      .collection('signups')
      .doc(user.id)
      .set({
        id: user.id,
        partySize: 1,
        hasPayed: true,
        hasAttended: false,
        timestamp: new Date(),
        isWaitList,
      });
  }

  public async deregister(user: any, event: any): Promise<void> {
    await this.store
      .collection('events')
      .doc(event.id)
      .collection('signups')
      .doc(user.id)
      .delete();
  }

  public getEventsForCurrentUser(): Observable<any[]> {
    return this.auth.user$.pipe(
      switchMap((user) => this.getEventsForUser(user.id))
    );
  }

  public getEventsForCurrentTutor(): Observable<any[]> {
    return this.auth.user$.pipe(
      switchMap((user) => this.getEventsForTutor(user.id))
    );
  }

  public getEventsForTutor(userId: string): Observable<any[]> {
    return this.store
      .collection('events', (ref) =>
        ref
          .where('tutorSignups', 'array-contains', userId)
          .orderBy('start', 'desc')
      )
      .valueChanges({ idField: 'id' })
      .pipe(this.mapEvents, shareReplay());
  }

  public getEventsForUser(userId: string): Observable<any[]> {
    return this.store
      .collectionGroup('signups', (ref) =>
        ref.where('id', '==', userId).orderBy('timestamp', 'desc')
      )
      .snapshotChanges()
      .pipe(
        map((changes) => changes.map((change) => change.payload.doc)),
        switchMap((signups) =>
          signups.length
            ? combineLatest(
                signups.map((registration: any) => {
                  const parentRef = registration.ref.parent.parent;
                  if (!parentRef) {
                    return of({});
                  }
                  return fromPromise(parentRef.get()).pipe(
                    map((eventRef: any) => eventRef.data()),
                    map((event) =>
                      Object.assign({}, event, {
                        id: parentRef.id,
                        hasPayed: registration.data().hasPayed,
                        isWaitList: registration.data().isWaitList || false,
                      })
                    )
                  );
                })
              )
            : of([])
        ),
        this.mapEvents,
        catchError((err) => {
          console.log(err);
          return of([]);
        })
      );
  }

  private transformEvent = (event: any) => {
    return {
      ...event,
      start: event.start.toDate(),
      end: event.end.toDate(),
      registeredTutors: this.userService.getUserList$(event.tutorSignups),
      registrations: combineLatest([
        this.store
          .collection('events')
          .doc(event.id)
          .collection('signups')
          .valueChanges({ idField: 'id' }),
        this.auth.isTutor$,
      ]).pipe(
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
