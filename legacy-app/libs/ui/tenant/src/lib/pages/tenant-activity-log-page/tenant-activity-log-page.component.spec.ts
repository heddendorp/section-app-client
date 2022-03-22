import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantActivityLogPageComponent } from './tenant-activity-log-page.component';

describe('TenantActivityLogPageComponent', () => {
  let component: TenantActivityLogPageComponent;
  let fixture: ComponentFixture<TenantActivityLogPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantActivityLogPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantActivityLogPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
