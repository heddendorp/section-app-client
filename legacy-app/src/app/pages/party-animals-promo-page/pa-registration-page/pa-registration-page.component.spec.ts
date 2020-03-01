import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaRegistrationPageComponent } from './pa-registration-page.component';

describe('PaRegistrationPageComponent', () => {
  let component: PaRegistrationPageComponent;
  let fixture: ComponentFixture<PaRegistrationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaRegistrationPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaRegistrationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
