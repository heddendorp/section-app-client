import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SosPageComponent } from './sos-page.component';

describe('SosPageComponent', () => {
  let component: SosPageComponent;
  let fixture: ComponentFixture<SosPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SosPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SosPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
