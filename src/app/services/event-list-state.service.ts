import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventListStateService {
  private selectedView$ = new BehaviorSubject('list');
  constructor() {
    const savedView = localStorage.getItem('selectedView');
    if (savedView) {
      this.selectedView$.next(savedView);
    }
    this.selectedView$.subscribe((view) => {
      localStorage.setItem('selectedView', view);
    });
  }

  getSelectedView() {
    return this.selectedView$.asObservable();
  }

  setSelectedView(view: string) {
    this.selectedView$.next(view);
  }
}
