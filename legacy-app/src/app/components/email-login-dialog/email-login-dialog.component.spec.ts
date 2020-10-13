import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailLoginDialogComponent } from './email-login-dialog.component';

describe('EmailLoginDialogComponent', () => {
  let component: EmailLoginDialogComponent;
  let fixture: ComponentFixture<EmailLoginDialogComponent>;

  beforeEach(async(() => {
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
