import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsnCardComponent } from './esn-card.component';

describe('EsnCardComponent', () => {
  let component: EsnCardComponent;
  let fixture: ComponentFixture<EsnCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsnCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsnCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
