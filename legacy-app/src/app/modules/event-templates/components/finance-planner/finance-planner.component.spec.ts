import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancePlannerComponent } from './finance-planner.component';

describe('FinancePlannerComponent', () => {
  let component: FinancePlannerComponent;
  let fixture: ComponentFixture<FinancePlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancePlannerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancePlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
