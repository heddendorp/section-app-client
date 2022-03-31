import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantRegistrationDetailsPageComponent } from './tenant-registration-details-page.component';

describe('TenantRegistrationDetailsPageComponent', () => {
  let component: TenantRegistrationDetailsPageComponent;
  let fixture: ComponentFixture<TenantRegistrationDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenantRegistrationDetailsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantRegistrationDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
