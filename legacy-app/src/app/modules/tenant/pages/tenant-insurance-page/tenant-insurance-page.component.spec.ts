import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantInsurancePageComponent } from './tenant-insurance-page.component';

describe('TenantInsurancePageComponent', () => {
  let component: TenantInsurancePageComponent;
  let fixture: ComponentFixture<TenantInsurancePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantInsurancePageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantInsurancePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
