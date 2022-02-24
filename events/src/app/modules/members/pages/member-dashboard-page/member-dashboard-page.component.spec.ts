import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberDashboardPageComponent } from './member-dashboard-page.component';

describe('MemberDashboardPageComponent', () => {
  let component: MemberDashboardPageComponent;
  let fixture: ComponentFixture<MemberDashboardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberDashboardPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberDashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
