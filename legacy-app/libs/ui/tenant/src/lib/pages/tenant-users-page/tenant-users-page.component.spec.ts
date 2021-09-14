import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantUsersPageComponent } from './tenant-users-page.component';

describe('TenantUsersPageComponent', () => {
  let component: TenantUsersPageComponent;
  let fixture: ComponentFixture<TenantUsersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantUsersPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantUsersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
