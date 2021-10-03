import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEventFinancesComponent } from './manage-event-finances.component';

describe('ManageEventFinancesComponent', () => {
  let component: ManageEventFinancesComponent;
  let fixture: ComponentFixture<ManageEventFinancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageEventFinancesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageEventFinancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
