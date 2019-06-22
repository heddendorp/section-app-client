import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvInputDialogComponent } from './csv-input-dialog.component';

describe('CsvInputDialogComponent', () => {
  let component: CsvInputDialogComponent;
  let fixture: ComponentFixture<CsvInputDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CsvInputDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvInputDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
