import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExternalRegistrationComponent } from './external-registration.component';

describe('ExternalRegistrationComponent', () => {
  let component: ExternalRegistrationComponent;
  let fixture: ComponentFixture<ExternalRegistrationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExternalRegistrationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
