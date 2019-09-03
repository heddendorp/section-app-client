import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowUsereventsComponent } from './show-userevents.component';

describe('ShowUsereventsComponent', () => {
  let component: ShowUsereventsComponent;
  let fixture: ComponentFixture<ShowUsereventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShowUsereventsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowUsereventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
