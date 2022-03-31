import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantPurchasesPageComponent } from './tenant-purchases-page.component';

describe('TenantPurchasesPageComponent', () => {
  let component: TenantPurchasesPageComponent;
  let fixture: ComponentFixture<TenantPurchasesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantPurchasesPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantPurchasesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
