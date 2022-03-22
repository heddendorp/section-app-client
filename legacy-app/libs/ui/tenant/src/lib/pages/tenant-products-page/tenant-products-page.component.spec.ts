import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantProductsPageComponent } from './tenant-products-page.component';

describe('TenantProductsPageComponent', () => {
  let component: TenantProductsPageComponent;
  let fixture: ComponentFixture<TenantProductsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantProductsPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantProductsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
