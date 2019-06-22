import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredListComponent } from './registered-list.component';

describe('RegisteredListComponent', () => {
  let component: RegisteredListComponent;
  let fixture: ComponentFixture<RegisteredListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisteredListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
