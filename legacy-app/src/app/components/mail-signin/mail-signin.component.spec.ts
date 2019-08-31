import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailSigninComponent } from './mail-signin.component';

describe('MailSigninComponent', () => {
  let component: MailSigninComponent;
  let fixture: ComponentFixture<MailSigninComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MailSigninComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
