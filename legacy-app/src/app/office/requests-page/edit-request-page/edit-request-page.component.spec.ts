import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRequestPageComponent } from './edit-request-page.component';

describe('EditRequestPageComponent', () => {
  let component: EditRequestPageComponent;
  let fixture: ComponentFixture<EditRequestPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditRequestPageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRequestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
