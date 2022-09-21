import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSubmissionOverviewComponent } from './event-submission-overview.component';

describe('EventSubmissionOverviewComponent', () => {
  let component: EventSubmissionOverviewComponent;
  let fixture: ComponentFixture<EventSubmissionOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventSubmissionOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventSubmissionOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
