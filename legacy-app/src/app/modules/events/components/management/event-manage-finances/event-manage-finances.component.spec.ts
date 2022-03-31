import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventManageFinancesComponent } from './event-manage-finances.component';

describe('EventManageFinancesComponent', () => {
  let component: EventManageFinancesComponent;
  let fixture: ComponentFixture<EventManageFinancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventManageFinancesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventManageFinancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
