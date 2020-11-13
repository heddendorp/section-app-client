import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoginOptionsDialogComponent } from './login-options-dialog.component';

describe('LoginOptionsDialogComponent', () => {
  let component: LoginOptionsDialogComponent;
  let fixture: ComponentFixture<LoginOptionsDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoginOptionsDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginOptionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
