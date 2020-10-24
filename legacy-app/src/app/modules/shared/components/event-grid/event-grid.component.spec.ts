import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventGridComponent } from './event-grid.component';

describe('EventListComponent', () => {
  let component: EventGridComponent;
  let fixture: ComponentFixture<EventGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventGridComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
