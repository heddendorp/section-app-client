import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantRegistrationsPageComponent } from './tenant-registrations-page.component';

describe('TenantRegistrationsPageComponent', () => {
  let component: TenantRegistrationsPageComponent;
  let fixture: ComponentFixture<TenantRegistrationsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantRegistrationsPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantRegistrationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
