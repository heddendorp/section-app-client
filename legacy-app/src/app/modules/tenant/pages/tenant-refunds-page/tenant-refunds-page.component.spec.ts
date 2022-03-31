import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantRefundsPageComponent } from './tenant-refunds-page.component';

describe('TenantRefundsPageComponent', () => {
  let component: TenantRefundsPageComponent;
  let fixture: ComponentFixture<TenantRefundsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantRefundsPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantRefundsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
