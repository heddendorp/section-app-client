import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLocationDialogComponent } from './select-location-dialog.component';

describe('SelectLocationDialogComponent', () => {
  let component: SelectLocationDialogComponent;
  let fixture: ComponentFixture<SelectLocationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectLocationDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectLocationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
