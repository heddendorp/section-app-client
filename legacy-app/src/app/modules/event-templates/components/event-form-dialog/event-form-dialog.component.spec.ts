import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventFormDialogComponent } from './event-form-dialog.component';

describe('EventFormDialogComponent', () => {
  let component: EventFormDialogComponent;
  let fixture: ComponentFixture<EventFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventFormDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
