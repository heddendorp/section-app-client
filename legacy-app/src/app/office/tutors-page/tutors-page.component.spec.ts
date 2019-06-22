import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorsPageComponent } from './tutors-page.component';

describe('TutorsPageComponent', () => {
  let component: TutorsPageComponent;
  let fixture: ComponentFixture<TutorsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TutorsPageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
