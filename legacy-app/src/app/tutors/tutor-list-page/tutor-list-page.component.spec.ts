import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorListPageComponent } from './tutor-list-page.component';

describe('TutorListPageComponent', () => {
  let component: TutorListPageComponent;
  let fixture: ComponentFixture<TutorListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TutorListPageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
