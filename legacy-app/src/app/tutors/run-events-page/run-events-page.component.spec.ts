import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunEventsPageComponent } from './run-events-page.component';

describe('RunEventsPageComponent', () => {
  let component: RunEventsPageComponent;
  let fixture: ComponentFixture<RunEventsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RunEventsPageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunEventsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
