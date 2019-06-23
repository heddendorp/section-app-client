import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSignupDialogComponent } from './event-signup-dialog.component';

describe('EventSignupDialogComponent', () => {
  let component: EventSignupDialogComponent;
  let fixture: ComponentFixture<EventSignupDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventSignupDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventSignupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
