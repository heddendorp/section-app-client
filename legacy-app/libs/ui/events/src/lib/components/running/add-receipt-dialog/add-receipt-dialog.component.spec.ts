import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReceiptDialogComponent } from './add-receipt-dialog.component';

describe('AddReceiptDialogComponent', () => {
  let component: AddReceiptDialogComponent;
  let fixture: ComponentFixture<AddReceiptDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddReceiptDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReceiptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
