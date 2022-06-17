import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantMetricsPageComponent } from './tenant-metrics-page.component';

describe('TenantMetricsPageComponent', () => {
  let component: TenantMetricsPageComponent;
  let fixture: ComponentFixture<TenantMetricsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenantMetricsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantMetricsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
