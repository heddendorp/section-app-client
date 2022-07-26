import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventRunPageComponent } from './event-run-page.component';

describe('EventRunPageComponent', () => {
  let component: EventRunPageComponent;
  let fixture: ComponentFixture<EventRunPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventRunPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventRunPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
