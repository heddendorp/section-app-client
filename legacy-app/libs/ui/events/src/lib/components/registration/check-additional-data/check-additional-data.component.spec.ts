import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckAdditionalDataComponent } from './check-additional-data.component';

describe('CheckAdditionalDataComponent', () => {
  let component: CheckAdditionalDataComponent;
  let fixture: ComponentFixture<CheckAdditionalDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckAdditionalDataComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckAdditionalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
