import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDataItemDialogComponent } from './new-data-item-dialog.component';

describe('NewDataItemDialogComponent', () => {
  let component: NewDataItemDialogComponent;
  let fixture: ComponentFixture<NewDataItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewDataItemDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDataItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
