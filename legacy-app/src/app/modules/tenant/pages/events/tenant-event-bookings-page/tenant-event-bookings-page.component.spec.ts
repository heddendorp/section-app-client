import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantEventBookingsPageComponent } from './tenant-event-bookings-page.component';

describe('TenantEventBookingsPageComponent', () => {
  let component: TenantEventBookingsPageComponent;
  let fixture: ComponentFixture<TenantEventBookingsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantEventBookingsPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantEventBookingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
