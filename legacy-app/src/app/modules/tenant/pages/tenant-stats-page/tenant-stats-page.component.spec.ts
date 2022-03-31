import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantStatsPageComponent } from './tenant-stats-page.component';

describe('TenantStatsPageComponent', () => {
  let component: TenantStatsPageComponent;
  let fixture: ComponentFixture<TenantStatsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantStatsPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantStatsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
