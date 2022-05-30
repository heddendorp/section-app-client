import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectWithAutocompleteDialogComponent } from './select-with-autocomplete-dialog.component';

describe('SelectWithAutocompleteDialogComponent', () => {
  let component: SelectWithAutocompleteDialogComponent;
  let fixture: ComponentFixture<SelectWithAutocompleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectWithAutocompleteDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectWithAutocompleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
