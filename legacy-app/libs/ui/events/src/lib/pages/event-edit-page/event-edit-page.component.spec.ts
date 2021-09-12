import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventEditPageComponent } from './event-edit-page.component';

describe('EventEditPageComponent', () => {
  let component: EventEditPageComponent;
  let fixture: ComponentFixture<EventEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventEditPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
