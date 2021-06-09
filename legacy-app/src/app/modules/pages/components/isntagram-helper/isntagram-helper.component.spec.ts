import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsntagramHelperComponent } from './isntagram-helper.component';

describe('IsntagramHelperComponent', () => {
  let component: IsntagramHelperComponent;
  let fixture: ComponentFixture<IsntagramHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsntagramHelperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsntagramHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
