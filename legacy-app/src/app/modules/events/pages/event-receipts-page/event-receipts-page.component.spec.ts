import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventReceiptsPageComponent } from './event-receipts-page.component';

describe('EventReceiptsPageComponent', () => {
  let component: EventReceiptsPageComponent;
  let fixture: ComponentFixture<EventReceiptsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventReceiptsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventReceiptsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
