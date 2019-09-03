import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayEventInfoComponent } from './display-event-info.component';

describe('DisplayEventInfoComponent', () => {
  let component: DisplayEventInfoComponent;
  let fixture: ComponentFixture<DisplayEventInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayEventInfoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayEventInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
