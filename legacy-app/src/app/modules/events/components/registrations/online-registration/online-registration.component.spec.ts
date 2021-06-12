import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OnlineRegistrationComponent } from './online-registration.component';

describe('OnlineRegistrationComponent', () => {
  let component: OnlineRegistrationComponent;
  let fixture: ComponentFixture<OnlineRegistrationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OnlineRegistrationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
