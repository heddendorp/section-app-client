import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeEventRegistrationComponent } from './stripe-event-registration.component';

describe('StripeEventRegistrationComponent', () => {
  let component: StripeEventRegistrationComponent;
  let fixture: ComponentFixture<StripeEventRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StripeEventRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeEventRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
