import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleTableComponent } from './people-table.component';

describe('PeopleTableComponent', () => {
  let component: PeopleTableComponent;
  let fixture: ComponentFixture<PeopleTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PeopleTableComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
