import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantRegistrationCodePageComponent } from './tenant-registration-code-page.component';

describe('TenantRegistrationCodePageComponent', () => {
  let component: TenantRegistrationCodePageComponent;
  let fixture: ComponentFixture<TenantRegistrationCodePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantRegistrationCodePageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantRegistrationCodePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
