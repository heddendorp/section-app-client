import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceDialogComponent } from './attendance-dialog.component';

describe('AttendanceDialogComponent', () => {
  let component: AttendanceDialogComponent;
  let fixture: ComponentFixture<AttendanceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttendanceDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
