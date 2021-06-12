import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeRegistrationComponent } from './stripe-registration.component';

describe('StripeRegistrationComponent', () => {
  let component: StripeRegistrationComponent;
  let fixture: ComponentFixture<StripeRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StripeRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
