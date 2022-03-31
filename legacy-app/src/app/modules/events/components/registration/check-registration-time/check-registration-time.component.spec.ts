import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckRegistrationTimeComponent } from './check-registration-time.component';

describe('CheckRegistrationTimeComponent', () => {
  let component: CheckRegistrationTimeComponent;
  let fixture: ComponentFixture<CheckRegistrationTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckRegistrationTimeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckRegistrationTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
