import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEventPageComponent } from './view-event-page.component';

describe('ViewEventPageComponent', () => {
  let component: ViewEventPageComponent;
  let fixture: ComponentFixture<ViewEventPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewEventPageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEventPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
