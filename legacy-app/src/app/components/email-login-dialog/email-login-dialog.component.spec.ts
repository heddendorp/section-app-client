import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmailLoginDialogComponent } from './email-login-dialog.component';

describe('EmailLoginDialogComponent', () => {
  let component: EmailLoginDialogComponent;
  let fixture: ComponentFixture<EmailLoginDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EmailLoginDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailLoginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
