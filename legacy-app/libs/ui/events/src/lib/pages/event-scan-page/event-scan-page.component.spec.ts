import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventScanPageComponent } from './event-scan-page.component';

describe('EventScanPageComponent', () => {
  let component: EventScanPageComponent;
  let fixture: ComponentFixture<EventScanPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventScanPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventScanPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
