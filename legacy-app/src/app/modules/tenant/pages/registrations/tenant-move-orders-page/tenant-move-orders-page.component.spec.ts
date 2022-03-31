import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantMoveOrdersPageComponent } from './tenant-move-orders-page.component';

describe('TenantMoveOrdersPageComponent', () => {
  let component: TenantMoveOrdersPageComponent;
  let fixture: ComponentFixture<TenantMoveOrdersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantMoveOrdersPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantMoveOrdersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
