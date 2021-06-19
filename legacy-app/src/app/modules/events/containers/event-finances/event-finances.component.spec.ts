import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventFinancesComponent } from './event-finances.component';

describe('EventFinancesComponent', () => {
  let component: EventFinancesComponent;
  let fixture: ComponentFixture<EventFinancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventFinancesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventFinancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
