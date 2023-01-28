import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AugsburgHomeComponent } from './augsburg-home.component';

describe('AugsburgHomeComponent', () => {
  let component: AugsburgHomeComponent;
  let fixture: ComponentFixture<AugsburgHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AugsburgHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AugsburgHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
