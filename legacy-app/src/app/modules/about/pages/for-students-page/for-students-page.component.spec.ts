import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForStudentsPageComponent } from './for-students-page.component';

describe('ForStudentsPageComponent', () => {
  let component: ForStudentsPageComponent;
  let fixture: ComponentFixture<ForStudentsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForStudentsPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForStudentsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
