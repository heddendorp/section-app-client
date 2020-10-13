import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventListPageComponent } from './event-list-page.component';

describe('EventListPageComponent', () => {
  let component: EventListPageComponent;
  let fixture: ComponentFixture<EventListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventListPageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
