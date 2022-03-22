import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSubmissionDialogComponent } from './event-submission-dialog.component';

describe('EventSubmissionDialogComponent', () => {
  let component: EventSubmissionDialogComponent;
  let fixture: ComponentFixture<EventSubmissionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventSubmissionDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventSubmissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
