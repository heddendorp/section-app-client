import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantEventsPageComponent } from './tenant-events-page.component';

describe('TenantEventsPageComponent', () => {
  let component: TenantEventsPageComponent;
  let fixture: ComponentFixture<TenantEventsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantEventsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TenantEventsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
