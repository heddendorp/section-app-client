import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnonymousRegistrationComponent } from './anonymous-registration.component';

describe('AnonymousRegistrationComponent', () => {
  let component: AnonymousRegistrationComponent;
  let fixture: ComponentFixture<AnonymousRegistrationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AnonymousRegistrationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnonymousRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
