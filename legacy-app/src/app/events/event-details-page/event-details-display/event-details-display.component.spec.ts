import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailsDisplayComponent } from './event-details-display.component';

describe('EventDetailsDisplayComponent', () => {
  let component: EventDetailsDisplayComponent;
  let fixture: ComponentFixture<EventDetailsDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventDetailsDisplayComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDetailsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
