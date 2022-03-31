import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantPurchaseDetailsPageComponent } from './tenant-purchase-details-page.component';

describe('TenantPurchaseDetailsPageComponent', () => {
  let component: TenantPurchaseDetailsPageComponent;
  let fixture: ComponentFixture<TenantPurchaseDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantPurchaseDetailsPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantPurchaseDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
