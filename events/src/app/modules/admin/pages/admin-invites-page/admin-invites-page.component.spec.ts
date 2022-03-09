import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInvitesPageComponent } from './admin-invites-page.component';

describe('AdminInvitesPageComponent', () => {
  let component: AdminInvitesPageComponent;
  let fixture: ComponentFixture<AdminInvitesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminInvitesPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminInvitesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
