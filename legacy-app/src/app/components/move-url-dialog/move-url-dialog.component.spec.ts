import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveUrlDialogComponent } from './move-url-dialog.component';

describe('MoveUrlDialogComponent', () => {
  let component: MoveUrlDialogComponent;
  let fixture: ComponentFixture<MoveUrlDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoveUrlDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveUrlDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
