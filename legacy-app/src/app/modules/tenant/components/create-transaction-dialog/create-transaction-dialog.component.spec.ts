import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTransactionDialogComponent } from './create-transaction-dialog.component';

describe('CreateTransactionDialogComponent', () => {
  let component: CreateTransactionDialogComponent;
  let fixture: ComponentFixture<CreateTransactionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTransactionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTransactionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
