import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanningDialogComponent } from './scanning-dialog.component';

describe('ScanningDialogComponent', () => {
  let component: ScanningDialogComponent;
  let fixture: ComponentFixture<ScanningDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScanningDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
