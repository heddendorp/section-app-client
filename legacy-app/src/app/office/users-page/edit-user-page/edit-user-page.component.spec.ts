import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserPageComponent } from './edit-user-page.component';

describe('EditUserPageComponent', () => {
  let component: EditUserPageComponent;
  let fixture: ComponentFixture<EditUserPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditUserPageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
