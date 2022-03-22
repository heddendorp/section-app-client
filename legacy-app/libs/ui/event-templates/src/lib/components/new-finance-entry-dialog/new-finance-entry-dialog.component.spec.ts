import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFinanceEntryDialogComponent } from './new-finance-entry-dialog.component';

describe('NewFinanceEntryDialogComponent', () => {
  let component: NewFinanceEntryDialogComponent;
  let fixture: ComponentFixture<NewFinanceEntryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewFinanceEntryDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFinanceEntryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
