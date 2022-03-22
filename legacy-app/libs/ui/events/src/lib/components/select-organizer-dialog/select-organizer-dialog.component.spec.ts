import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOrganizerDialogComponent } from './select-organizer-dialog.component';

describe('SelectOrganizerDialogComponent', () => {
  let component: SelectOrganizerDialogComponent;
  let fixture: ComponentFixture<SelectOrganizerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectOrganizerDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectOrganizerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
