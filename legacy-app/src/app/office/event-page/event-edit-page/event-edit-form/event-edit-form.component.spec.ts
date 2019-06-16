import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventEditFormComponent } from './event-edit-form.component';

describe('EventEditFormComponent', () => {
  let component: EventEditFormComponent;
  let fixture: ComponentFixture<EventEditFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventEditFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
