import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEventPageComponent } from './new-event-page.component';

describe('NewEventPageComponent', () => {
  let component: NewEventPageComponent;
  let fixture: ComponentFixture<NewEventPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewEventPageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEventPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
