import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalSupportComponent } from './technical-support.component';

describe('TechnicalSupportComponent', () => {
  let component: TechnicalSupportComponent;
  let fixture: ComponentFixture<TechnicalSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicalSupportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
