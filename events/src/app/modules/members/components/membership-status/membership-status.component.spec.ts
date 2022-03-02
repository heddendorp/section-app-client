import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipStatusComponent } from './membership-status.component';

describe('MembershipStatusComponent', () => {
  let component: MembershipStatusComponent;
  let fixture: ComponentFixture<MembershipStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MembershipStatusComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
