import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayEventUsersComponent } from './display-event-users.component';

describe('DisplayEventUsersComponent', () => {
  let component: DisplayEventUsersComponent;
  let fixture: ComponentFixture<DisplayEventUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayEventUsersComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayEventUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
