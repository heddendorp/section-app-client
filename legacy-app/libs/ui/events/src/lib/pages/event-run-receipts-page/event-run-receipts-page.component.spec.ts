import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventRunReceiptsPageComponent } from './event-run-receipts-page.component';

describe('EventRunReceiptsPageComponent', () => {
  let component: EventRunReceiptsPageComponent;
  let fixture: ComponentFixture<EventRunReceiptsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventRunReceiptsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventRunReceiptsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
