import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingLabelsPageComponent } from './shipping-labels-page.component';

describe('ShippingLabelsPageComponent', () => {
  let component: ShippingLabelsPageComponent;
  let fixture: ComponentFixture<ShippingLabelsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippingLabelsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingLabelsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
