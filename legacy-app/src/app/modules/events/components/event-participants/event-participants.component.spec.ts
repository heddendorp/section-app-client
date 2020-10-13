import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventParticipantsComponent } from './event-participants.component';

describe('EventParticipantsComponent', () => {
  let component: EventParticipantsComponent;
  let fixture: ComponentFixture<EventParticipantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventParticipantsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
