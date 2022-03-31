import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventManageVotingComponent } from './event-manage-voting.component';

describe('EventManageVotingComponent', () => {
  let component: EventManageVotingComponent;
  let fixture: ComponentFixture<EventManageVotingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventManageVotingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventManageVotingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
