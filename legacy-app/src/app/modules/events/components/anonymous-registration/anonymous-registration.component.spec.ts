import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonymousRegistrationComponent } from './anonymous-registration.component';

describe('AnonymousRegistrationComponent', () => {
  let component: AnonymousRegistrationComponent;
  let fixture: ComponentFixture<AnonymousRegistrationComponent>;

  beforeEach(async(() => {
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
