import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventManagePageComponent } from './event-manage-page.component';

describe('EventManagePageComponent', () => {
  let component: EventManagePageComponent;
  let fixture: ComponentFixture<EventManagePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventManagePageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventManagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
