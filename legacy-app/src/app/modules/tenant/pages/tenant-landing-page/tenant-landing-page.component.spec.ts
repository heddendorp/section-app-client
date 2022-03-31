import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantLandingPageComponent } from './tenant-landing-page.component';

describe('TenantLandingPageComponent', () => {
  let component: TenantLandingPageComponent;
  let fixture: ComponentFixture<TenantLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantLandingPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
