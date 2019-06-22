import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsPageComponent } from './students-page.component';

describe('StudentsPageComponent', () => {
  let component: StudentsPageComponent;
  let fixture: ComponentFixture<StudentsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StudentsPageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
