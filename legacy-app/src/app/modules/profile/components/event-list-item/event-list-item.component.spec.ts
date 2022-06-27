import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventListItemComponent } from './event-list-item.component';

describe('EventListItemComponent', () => {
  let component: EventListItemComponent;
  let fixture: ComponentFixture<EventListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventListItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
