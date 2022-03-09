import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInvitesCreatePageComponent } from './admin-invites-create-page.component';

describe('AdminInvitesCreatePageComponent', () => {
  let component: AdminInvitesCreatePageComponent;
  let fixture: ComponentFixture<AdminInvitesCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminInvitesCreatePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminInvitesCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
