import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveEventDialogComponent } from './move-event-dialog.component';

describe('MoveEventDialogComponent', () => {
  let component: MoveEventDialogComponent;
  let fixture: ComponentFixture<MoveEventDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoveEventDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
