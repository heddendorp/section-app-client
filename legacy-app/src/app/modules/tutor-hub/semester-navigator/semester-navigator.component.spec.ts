import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemesterNavigatorComponent } from './semester-navigator.component';

describe('SemesterNavigatorComponent', () => {
  let component: SemesterNavigatorComponent;
  let fixture: ComponentFixture<SemesterNavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SemesterNavigatorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SemesterNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
