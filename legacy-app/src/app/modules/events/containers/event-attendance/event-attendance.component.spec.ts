import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventAttendanceComponent } from './event-attendance.component';

describe('EventAttendanceComponent', () => {
  let component: EventAttendanceComponent;
  let fixture: ComponentFixture<EventAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventAttendanceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
