import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiAuthButtonComponent } from './auth-button.component';

describe('UiAuthButtonComponent', () => {
  let component: UiAuthButtonComponent;
  let fixture: ComponentFixture<UiAuthButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiAuthButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiAuthButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
