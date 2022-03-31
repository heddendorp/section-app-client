import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOrganizerDialogComponent } from './new-organizer-dialog.component';

describe('NewOrganizerDialogComponent', () => {
  let component: NewOrganizerDialogComponent;
  let fixture: ComponentFixture<NewOrganizerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewOrganizerDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOrganizerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
