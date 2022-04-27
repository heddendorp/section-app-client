import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicRegistrationCodesPageComponent } from './public-registration-codes-page.component';

describe('PublicRegistrationCodesPageComponent', () => {
  let component: PublicRegistrationCodesPageComponent;
  let fixture: ComponentFixture<PublicRegistrationCodesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicRegistrationCodesPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicRegistrationCodesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
