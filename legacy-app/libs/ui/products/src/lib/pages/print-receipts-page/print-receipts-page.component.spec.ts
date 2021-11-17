import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintReceiptsPageComponent } from './print-receipts-page.component';

describe('PrintReceiptsPageComponent', () => {
  let component: PrintReceiptsPageComponent;
  let fixture: ComponentFixture<PrintReceiptsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintReceiptsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintReceiptsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
