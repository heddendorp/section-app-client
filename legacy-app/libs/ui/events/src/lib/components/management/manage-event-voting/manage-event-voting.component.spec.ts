import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEventVotingComponent } from './manage-event-voting.component';

describe('ManageEventVotingComponent', () => {
  let component: ManageEventVotingComponent;
  let fixture: ComponentFixture<ManageEventVotingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageEventVotingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageEventVotingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
