import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayPalRegistrationComponent } from './pay-pal-registration.component';

describe('PayPalRegistrationComponent', () => {
  let component: PayPalRegistrationComponent;
  let fixture: ComponentFixture<PayPalRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayPalRegistrationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayPalRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
