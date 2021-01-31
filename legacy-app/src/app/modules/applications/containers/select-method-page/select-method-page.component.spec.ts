import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMethodPageComponent } from './select-method-page.component';

describe('SelectMethodPageComponent', () => {
  let component: SelectMethodPageComponent;
  let fixture: ComponentFixture<SelectMethodPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectMethodPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMethodPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
