import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDataChangeComponent } from './user-data-change.component';

describe('UserDataChangeComponent', () => {
  let component: UserDataChangeComponent;
  let fixture: ComponentFixture<UserDataChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserDataChangeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDataChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
