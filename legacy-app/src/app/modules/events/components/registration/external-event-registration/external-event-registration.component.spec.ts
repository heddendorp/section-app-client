import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalEventRegistrationComponent } from './external-event-registration.component';

describe('ExternalEventRegistrationComponent', () => {
  let component: ExternalEventRegistrationComponent;
  let fixture: ComponentFixture<ExternalEventRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExternalEventRegistrationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalEventRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
