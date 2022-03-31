import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrDisplayDialogComponent } from './qr-display-dialog.component';

describe('QrDisplayDialogComponent', () => {
  let component: QrDisplayDialogComponent;
  let fixture: ComponentFixture<QrDisplayDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QrDisplayDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrDisplayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
