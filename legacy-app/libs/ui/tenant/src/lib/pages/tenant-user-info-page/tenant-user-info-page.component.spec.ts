import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantUserInfoPageComponent } from './tenant-user-info-page.component';

describe('TenantUserInfoPageComponent', () => {
  let component: TenantUserInfoPageComponent;
  let fixture: ComponentFixture<TenantUserInfoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantUserInfoPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantUserInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
