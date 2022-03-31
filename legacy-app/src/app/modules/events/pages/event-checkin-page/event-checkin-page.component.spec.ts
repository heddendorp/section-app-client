import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCheckinPageComponent } from './event-checkin-page.component';

describe('EventCheckinPageComponent', () => {
  let component: EventCheckinPageComponent;
  let fixture: ComponentFixture<EventCheckinPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventCheckinPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCheckinPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
