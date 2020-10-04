import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsPageComponent } from './appointments-page.component';

describe('AppointmentsPageComponent', () => {
  let component: AppointmentsPageComponent;
  let fixture: ComponentFixture<AppointmentsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
