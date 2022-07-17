import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantEventRatingsComponent } from './tenant-event-ratings.component';

describe('TenantEventRatingsComponent', () => {
  let component: TenantEventRatingsComponent;
  let fixture: ComponentFixture<TenantEventRatingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenantEventRatingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantEventRatingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
