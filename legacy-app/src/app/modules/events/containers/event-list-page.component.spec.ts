import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EventListPageComponent } from './event-list-page.component';

describe('EventListPageComponent', () => {
  let component: EventListPageComponent;
  let fixture: ComponentFixture<EventListPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EventListPageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
