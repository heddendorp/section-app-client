import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailsPageComponent } from './event-details-page.component';

describe('EventDetailsPageComponent', () => {
  let component: EventDetailsPageComponent;
  let fixture: ComponentFixture<EventDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventDetailsPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
