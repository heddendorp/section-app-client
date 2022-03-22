import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineEventRegistrationComponent } from './online-event-registration.component';

describe('OnlineEventRegistrationComponent', () => {
  let component: OnlineEventRegistrationComponent;
  let fixture: ComponentFixture<OnlineEventRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnlineEventRegistrationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineEventRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
